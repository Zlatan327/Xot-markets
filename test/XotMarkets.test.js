import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Xot Markets Protocol", function () {
  let mockToken, agentRegistry, reputationEngine, resolver, factory, binaryMarket, aaveMock, yieldRouter;
  let owner, addr1, addr2, addr3, arbitrationCouncil, prizeVault;
  let targetAgent;
  const FEE_PERCENT = 150n; // 1.5%
  const DENOMINATOR = 10000n;
  const MIN_CHALLENGE_BOND = hre.ethers.parseEther("500");

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, arbitrationCouncil, prizeVault, targetAgent] = await hre.ethers.getSigners();

    // Deploy Mocks
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("USD Coin", "USDC", 18);

    const AgentRegistryMock = await hre.ethers.getContractFactory("AgentRegistryMock");
    agentRegistry = await AgentRegistryMock.deploy();

    const ReputationEngineMock = await hre.ethers.getContractFactory("ReputationEngineMock");
    reputationEngine = await ReputationEngineMock.deploy();

    const AavePoolMock = await hre.ethers.getContractFactory("AavePoolMock");
    aaveMock = await AavePoolMock.deploy();

    // Deploy YieldRouter
    const YieldRouter = await hre.ethers.getContractFactory("YieldRouter");
    yieldRouter = await YieldRouter.deploy(await mockToken.getAddress(), prizeVault.address);

    // Deploy Factory
    const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
    factory = await MarketFactory.deploy(owner.address, await aaveMock.getAddress());
    await factory.setYieldRouter(await yieldRouter.getAddress());

    // Deploy Resolver
    const Resolver = await hre.ethers.getContractFactory("Resolver");
    resolver = await Resolver.deploy(
      await agentRegistry.getAddress(),
      await reputationEngine.getAddress(),
      arbitrationCouncil.address,
      MIN_CHALLENGE_BOND
    );

    // Register Target Agent and set data
    await agentRegistry.registerAgent(targetAgent.address);
    await agentRegistry.addPaidVolume(targetAgent.address, 10000); // 10,000 volume

    // Mint tokens to traders
    const amount = hre.ethers.parseEther("1000");
    await mockToken.mint(addr1.address, amount);
    await mockToken.mint(addr2.address, amount);
    await mockToken.mint(addr3.address, amount);
    await mockToken.mint(await aaveMock.getAddress(), hre.ethers.parseEther("10000")); // To simulate yield payouts

    // Create a Market via Factory
    const currentBlock = await hre.ethers.provider.getBlockNumber();
    const expiryBlock = currentBlock + 20; // Extra room for test txs
    
    await factory.createMarket(
      targetAgent.address,
      1, // Metric: Volume (1)
      5000, // Metric Threshold: 5,000 volume
      expiryBlock,
      await mockToken.getAddress(),
      await resolver.getAddress()
    );

    const marketAddress = await factory.deployedMarkets(0);
    const BinaryMarket = await hre.ethers.getContractFactory("BinaryMarket");
    binaryMarket = BinaryMarket.attach(marketAddress);
  });

  // ============================================================
  // PARI-MUTUEL OUTCOMES
  // ============================================================
  describe("Pari-mutuel outcomes", function () {
    it("Should calculate pari-mutuel payouts correctly on YES win", async function () {
      const amount1 = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
      await binaryMarket.connect(addr1).buyShares(true, amount1);

      const amount2 = hre.ethers.parseEther("300");
      await mockToken.connect(addr2).approve(await binaryMarket.getAddress(), amount2);
      await binaryMarket.connect(addr2).buyShares(false, amount2);

      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }

      await resolver.resolveMarket(await binaryMarket.getAddress());
      await time.increase(5 * 60 * 60);
      await resolver.finalizeResolution(await binaryMarket.getAddress());

      const balanceBefore1 = await mockToken.balanceOf(addr1.address);
      await binaryMarket.connect(addr1).claim();
      const balanceAfter1 = await mockToken.balanceOf(addr1.address);
      
      const net1 = amount1 - ((amount1 * FEE_PERCENT) / DENOMINATOR);
      const net2 = amount2 - ((amount2 * FEE_PERCENT) / DENOMINATOR);
      const totalPool = net1 + net2;

      expect(balanceAfter1 - balanceBefore1).to.equal(totalPool);
    });

    it("Should calculate pari-mutuel payouts correctly on NO win", async function () {
      const amount1 = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
      await binaryMarket.connect(addr1).buyShares(true, amount1);

      const amount2 = hre.ethers.parseEther("300");
      await mockToken.connect(addr2).approve(await binaryMarket.getAddress(), amount2);
      await binaryMarket.connect(addr2).buyShares(false, amount2);

      // Create a new market where threshold is very high (agent volume won't meet it)
      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await factory.createMarket(
        targetAgent.address,
        1, // Volume metric
        999999999, // Very high threshold — agent has 10000 volume
        currentBlock + 20, // Enough headroom for trade txs
        await mockToken.getAddress(),
        await resolver.getAddress()
      );
      const noMarketAddr = await factory.deployedMarkets(1);
      const BinaryMarket = await hre.ethers.getContractFactory("BinaryMarket");
      const noMarket = BinaryMarket.attach(noMarketAddr);

      const amt1 = hre.ethers.parseEther("200");
      const amt2 = hre.ethers.parseEther("400");
      await mockToken.connect(addr1).approve(noMarketAddr, amt1);
      await noMarket.connect(addr1).buyShares(true, amt1);
      await mockToken.connect(addr2).approve(noMarketAddr, amt2);
      await noMarket.connect(addr2).buyShares(false, amt2);

      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }

      await resolver.resolveMarket(noMarketAddr);
      await time.increase(5 * 60 * 60);
      await resolver.finalizeResolution(noMarketAddr);

      const balBefore = await mockToken.balanceOf(addr2.address);
      await noMarket.connect(addr2).claim();
      const balAfter = await mockToken.balanceOf(addr2.address);

      const netYes = amt1 - ((amt1 * FEE_PERCENT) / DENOMINATOR);
      const netNo = amt2 - ((amt2 * FEE_PERCENT) / DENOMINATOR);
      const totalPool = netYes + netNo;

      // NO winner gets entire pool
      expect(balAfter - balBefore).to.equal(totalPool);
    });

    it("Should refund both sides on VOID outcome", async function () {
      const amount1 = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
      await binaryMarket.connect(addr1).buyShares(true, amount1);

      const amount2 = hre.ethers.parseEther("200");
      await mockToken.connect(addr2).approve(await binaryMarket.getAddress(), amount2);
      await binaryMarket.connect(addr2).buyShares(false, amount2);

      // Resolve as VOID directly via resolver's arbitration path
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      
      // Challenge it
      const bondAmount = MIN_CHALLENGE_BOND;
      await mockToken.mint(addr3.address, bondAmount);
      await mockToken.connect(addr3).approve(await resolver.getAddress(), bondAmount);
      await resolver.connect(addr3).challengeResolution(await binaryMarket.getAddress());

      // Arbitrate as VOID
      await resolver.connect(arbitrationCouncil).arbitrate(await binaryMarket.getAddress(), 3); // VOID = 3

      const net1 = amount1 - ((amount1 * FEE_PERCENT) / DENOMINATOR);
      const net2 = amount2 - ((amount2 * FEE_PERCENT) / DENOMINATOR);

      const bal1Before = await mockToken.balanceOf(addr1.address);
      await binaryMarket.connect(addr1).claim();
      const bal1After = await mockToken.balanceOf(addr1.address);
      
      const bal2Before = await mockToken.balanceOf(addr2.address);
      await binaryMarket.connect(addr2).claim();
      const bal2After = await mockToken.balanceOf(addr2.address);

      // Each gets their shares back (minus fees already taken)
      expect(bal1After - bal1Before).to.equal(net1);
      expect(bal2After - bal2Before).to.equal(net2);
    });

    it("Should handle zero opposing pool (only YES buyers)", async function () {
      const amount1 = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
      await binaryMarket.connect(addr1).buyShares(true, amount1);

      // No one buys NO. Expire and resolve.
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      await time.increase(5 * 60 * 60);
      await resolver.finalizeResolution(await binaryMarket.getAddress());

      const net1 = amount1 - ((amount1 * FEE_PERCENT) / DENOMINATOR);

      const balBefore = await mockToken.balanceOf(addr1.address);
      await binaryMarket.connect(addr1).claim();
      const balAfter = await mockToken.balanceOf(addr1.address);

      // Winner gets their own shares back (total pool = yesPool since noPool is 0)
      expect(balAfter - balBefore).to.equal(net1);
    });
  });

  // ============================================================
  // ACCESS CONTROL
  // ============================================================
  describe("Access control", function () {
    it("setYieldRouter should revert for non-owner", async function () {
      await expect(
        factory.connect(addr1).setYieldRouter(addr2.address)
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });

    it("createMarket should revert for non-owner", async function () {
      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await expect(
        factory.connect(addr1).createMarket(
          targetAgent.address, 1, 5000, currentBlock + 10,
          await mockToken.getAddress(), await resolver.getAddress()
        )
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });

    it("sweepFees should revert for non-owner", async function () {
      await expect(
        factory.connect(addr1).sweepFees(await mockToken.getAddress())
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });

    it("resolveMarket on BinaryMarket should revert for non-resolver", async function () {
      await expect(
        binaryMarket.connect(addr1).resolveMarket(1) // YES
      ).to.be.revertedWith("Only resolver can resolve");
    });

    it("investToAave should revert for non-YieldRouter", async function () {
      await expect(
        binaryMarket.connect(addr1).investToAave(100)
      ).to.be.revertedWith("Only yield router");
    });
  });

  // ============================================================
  // CLAIM EDGE CASES
  // ============================================================
  describe("Claim edge cases", function () {
    async function resolveMarketAsYes() {
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      await time.increase(5 * 60 * 60);
      await resolver.finalizeResolution(await binaryMarket.getAddress());
    }

    it("Should revert on double claim", async function () {
      const amount = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount);
      await binaryMarket.connect(addr1).buyShares(true, amount);

      await resolveMarketAsYes();
      await binaryMarket.connect(addr1).claim();

      await expect(
        binaryMarket.connect(addr1).claim()
      ).to.be.revertedWith("Already claimed");
    });

    it("Should revert claim before resolution", async function () {
      const amount = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount);
      await binaryMarket.connect(addr1).buyShares(true, amount);

      await expect(
        binaryMarket.connect(addr1).claim()
      ).to.be.revertedWith("Not resolved yet");
    });

    it("Should allow claim with zero shares (zero payout, no revert)", async function () {
      // addr3 never bought shares
      const amount = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount);
      await binaryMarket.connect(addr1).buyShares(true, amount);

      await resolveMarketAsYes();

      const balBefore = await mockToken.balanceOf(addr3.address);
      await binaryMarket.connect(addr3).claim(); // Should not revert
      const balAfter = await mockToken.balanceOf(addr3.address);

      expect(balAfter - balBefore).to.equal(0n);
    });

    it("Should cap payout when contract balance is insufficient (PayoutCapped)", async function () {
      const amount1 = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
      await binaryMarket.connect(addr1).buyShares(true, amount1);

      const amount2 = hre.ethers.parseEther("200");
      await mockToken.connect(addr2).approve(await binaryMarket.getAddress(), amount2);
      await binaryMarket.connect(addr2).buyShares(false, amount2);

      // Invest all funds to Aave (simulating funds locked in Aave at resolution time)
      const net1 = amount1 - ((amount1 * FEE_PERCENT) / DENOMINATOR);
      const net2 = amount2 - ((amount2 * FEE_PERCENT) / DENOMINATOR);
      await yieldRouter.connect(owner).commandInvest(await binaryMarket.getAddress(), net1 + net2);

      // Now resolve — market has 0 balance but owes totalPool to winner
      await resolveMarketAsYes();

      // Claim should cap payout at available (0), emitting PayoutCapped
      await expect(binaryMarket.connect(addr1).claim())
        .to.emit(binaryMarket, "PayoutCapped");
    });
  });

  // ============================================================
  // RESOLVER FLOWS
  // ============================================================
  describe("Resolver flows", function () {
    it("Should auto-resolve YES when volume >= threshold", async function () {
      // Agent has 10000 volume, threshold is 5000
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      const res = await resolver.resolutions(await binaryMarket.getAddress());
      expect(res.proposedOutcome).to.equal(1); // YES
    });

    it("Should auto-resolve NO when volume < threshold", async function () {
      // Create market with threshold higher than agent's volume
      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await factory.createMarket(
        targetAgent.address, 1, 50000, // threshold 50k, agent has 10k
        currentBlock + 5, await mockToken.getAddress(), await resolver.getAddress()
      );
      const marketAddr = await factory.deployedMarkets(1);

      for (let i = 0; i < 6; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(marketAddr);
      const res = await resolver.resolutions(marketAddr);
      expect(res.proposedOutcome).to.equal(2); // NO
    });

    it("Should auto-resolve VOID when oracle fails (catch block)", async function () {
      // Deploy a new AgentRegistryMock but DON'T register any agent on it.
      // When Resolver calls getAgentPaidVolume on an unregistered agent,
      // the mock returns 0 but doesn't revert. So instead, we point to a
      // contract that WILL revert — use the AavePoolMock (wrong interface).
      const fakeRegistryAddress = await aaveMock.getAddress(); // Has no getAgentPaidVolume — will revert
      
      const FakeResolver = await hre.ethers.getContractFactory("Resolver");
      const fakeResolver = await FakeResolver.deploy(
        fakeRegistryAddress,
        await reputationEngine.getAddress(),
        arbitrationCouncil.address,
        MIN_CHALLENGE_BOND
      );

      const fakeAgent = "0xdead000000000000000000000000000000000000";
      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await factory.createMarket(
        fakeAgent, 1, 100,
        currentBlock + 5, await mockToken.getAddress(), await fakeResolver.getAddress()
      );
      const marketAddr = await factory.deployedMarkets(1);

      for (let i = 0; i < 6; i++) {
        await hre.network.provider.send("evm_mine", []);
      }

      await fakeResolver.resolveMarket(marketAddr);
      const res = await fakeResolver.resolutions(marketAddr);
      expect(res.proposedOutcome).to.equal(3); // VOID (not YES!)
    });

    it("Should allow challenge within window", async function () {
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());

      await mockToken.mint(addr1.address, MIN_CHALLENGE_BOND);
      await mockToken.connect(addr1).approve(await resolver.getAddress(), MIN_CHALLENGE_BOND);
      
      await expect(
        resolver.connect(addr1).challengeResolution(await binaryMarket.getAddress())
      ).to.emit(resolver, "Challenged");
    });

    it("Should revert challenge after window expires", async function () {
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      await time.increase(5 * 60 * 60); // 5 hours > 4 hour window

      await mockToken.mint(addr1.address, MIN_CHALLENGE_BOND);
      await mockToken.connect(addr1).approve(await resolver.getAddress(), MIN_CHALLENGE_BOND);

      await expect(
        resolver.connect(addr1).challengeResolution(await binaryMarket.getAddress())
      ).to.be.revertedWith("Challenge window passed");
    });

    it("Should refund challenger bond when arbitration overturns", async function () {
      // Setup: buy shares, expire, resolve
      const amount = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount);
      await binaryMarket.connect(addr1).buyShares(true, amount);

      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());

      // Challenge
      await mockToken.mint(addr3.address, MIN_CHALLENGE_BOND);
      await mockToken.connect(addr3).approve(await resolver.getAddress(), MIN_CHALLENGE_BOND);
      await resolver.connect(addr3).challengeResolution(await binaryMarket.getAddress());

      const balBefore = await mockToken.balanceOf(addr3.address);
      
      // Arbitrate with DIFFERENT outcome than proposed (overturn)
      const proposed = (await resolver.resolutions(await binaryMarket.getAddress())).proposedOutcome;
      const differentOutcome = proposed === 1n ? 2 : 1; // Flip YES<->NO
      await resolver.connect(arbitrationCouncil).arbitrate(await binaryMarket.getAddress(), differentOutcome);

      const balAfter = await mockToken.balanceOf(addr3.address);
      expect(balAfter - balBefore).to.equal(MIN_CHALLENGE_BOND); // Bond refunded
    });

    it("Should forfeit challenger bond when arbitration upholds", async function () {
      const amount = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount);
      await binaryMarket.connect(addr1).buyShares(true, amount);

      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());

      await mockToken.mint(addr3.address, MIN_CHALLENGE_BOND);
      await mockToken.connect(addr3).approve(await resolver.getAddress(), MIN_CHALLENGE_BOND);
      await resolver.connect(addr3).challengeResolution(await binaryMarket.getAddress());

      const balBefore = await mockToken.balanceOf(addr3.address);
      
      // Arbitrate with SAME outcome as proposed (uphold)
      const proposed = (await resolver.resolutions(await binaryMarket.getAddress())).proposedOutcome;
      await resolver.connect(arbitrationCouncil).arbitrate(await binaryMarket.getAddress(), Number(proposed));

      const balAfter = await mockToken.balanceOf(addr3.address);
      expect(balAfter).to.equal(balBefore); // Bond NOT refunded
    });

    it("Should finalize un-challenged resolution after window", async function () {
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      await time.increase(5 * 60 * 60);

      await expect(
        resolver.finalizeResolution(await binaryMarket.getAddress())
      ).to.emit(resolver, "Finalized");

      expect(await binaryMarket.finalOutcome()).to.not.equal(0); // No longer PENDING
    });

    it("Should revert finalizeResolution during challenge window", async function () {
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      // Don't advance time — still within 4-hour window

      await expect(
        resolver.finalizeResolution(await binaryMarket.getAddress())
      ).to.be.revertedWith("Challenge window still open");
    });
  });

  // ============================================================
  // AAVE / YIELD ROUTER
  // ============================================================
  describe("Aave and YieldRouter", function () {
    it("Should allow YieldRouter to securely invest and harvest Aave yield", async function () {
      const amount1 = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
      await binaryMarket.connect(addr1).buyShares(true, amount1);

      const net1 = amount1 - ((amount1 * FEE_PERCENT) / DENOMINATOR);

      // Invest to Aave
      await yieldRouter.connect(owner).commandInvest(await binaryMarket.getAddress(), net1);
      
      expect(await mockToken.balanceOf(await binaryMarket.getAddress())).to.equal(0n);
      expect(await aaveMock.deposits(await mockToken.getAddress(), await binaryMarket.getAddress())).to.equal(net1);

      // Simulate yield generation in Aave (+10 tokens)
      const yieldAmount = hre.ethers.parseEther("10");
      await aaveMock.simulateYield(await mockToken.getAddress(), await binaryMarket.getAddress(), yieldAmount);

      // Harvest Yield
      await yieldRouter.connect(owner).commandHarvest(await binaryMarket.getAddress());

      // Prize vault should have received exactly the yield amount
      expect(await mockToken.balanceOf(prizeVault.address)).to.equal(yieldAmount);
      
      // BinaryMarket should have exactly its principal back
      expect(await mockToken.balanceOf(await binaryMarket.getAddress())).to.equal(net1);
    });

    it("Should revert commandInvest for non-owner", async function () {
      await expect(
        yieldRouter.connect(addr1).commandInvest(await binaryMarket.getAddress(), 100)
      ).to.be.revertedWithCustomError(yieldRouter, "OwnableUnauthorizedAccount");
    });

    it("Should revert emergencyWithdrawFromAave before resolution", async function () {
      await expect(
        binaryMarket.connect(addr1).emergencyWithdrawFromAave()
      ).to.be.revertedWith("Market must be resolved to use emergency withdraw");
    });

    it("Should allow emergencyWithdrawFromAave after resolution", async function () {
      const amount = hre.ethers.parseEther("100");
      await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount);
      await binaryMarket.connect(addr1).buyShares(true, amount);

      const net = amount - ((amount * FEE_PERCENT) / DENOMINATOR);
      await yieldRouter.connect(owner).commandInvest(await binaryMarket.getAddress(), net);

      // Resolve market
      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver.resolveMarket(await binaryMarket.getAddress());
      await time.increase(5 * 60 * 60);
      await resolver.finalizeResolution(await binaryMarket.getAddress());

      // Emergency withdraw should work now
      await binaryMarket.connect(addr1).emergencyWithdrawFromAave();
      expect(await mockToken.balanceOf(await binaryMarket.getAddress())).to.equal(net);
    });
  });

  // ============================================================
  // MARKET FACTORY
  // ============================================================
  describe("MarketFactory", function () {
    it("Should return correct market count", async function () {
      expect(await factory.getMarketCount()).to.equal(1); // 1 from beforeEach

      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await factory.createMarket(
        targetAgent.address, 1, 5000, currentBlock + 100,
        await mockToken.getAddress(), await resolver.getAddress()
      );
      expect(await factory.getMarketCount()).to.equal(2);
    });

    it("Should revert createMarket when YieldRouter not set", async function () {
      const NewFactory = await hre.ethers.getContractFactory("MarketFactory");
      const newFactory = await NewFactory.deploy(owner.address, await aaveMock.getAddress());
      // Don't set YieldRouter

      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await expect(
        newFactory.createMarket(
          targetAgent.address, 1, 5000, currentBlock + 10,
          await mockToken.getAddress(), await resolver.getAddress()
        )
      ).to.be.revertedWith("YieldRouter not set");
    });
  });

  // ============================================================
  // 6-DECIMAL USDC COMPATIBILITY (ethskills compliance)
  // ============================================================
  describe("6-decimal USDC compatibility", function () {
    let usdc6, market6, factory6, resolver6;

    beforeEach(async function () {
      const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
      usdc6 = await MockERC20.deploy("USD Coin", "USDC", 6);

      const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
      factory6 = await MarketFactory.deploy(owner.address, await aaveMock.getAddress());

      const YR = await hre.ethers.getContractFactory("YieldRouter");
      const yr6 = await YR.deploy(await usdc6.getAddress(), prizeVault.address);
      await factory6.setYieldRouter(await yr6.getAddress());

      // 500 USDC with 6 decimals = 500 * 10^6
      const bond6 = 500n * 10n ** 6n;
      const Resolver = await hre.ethers.getContractFactory("Resolver");
      resolver6 = await Resolver.deploy(
        await agentRegistry.getAddress(),
        await reputationEngine.getAddress(),
        arbitrationCouncil.address,
        bond6
      );

      const currentBlock = await hre.ethers.provider.getBlockNumber();
      await factory6.createMarket(
        targetAgent.address, 1, 5000, currentBlock + 20,
        await usdc6.getAddress(), await resolver6.getAddress()
      );

      const marketAddr = await factory6.deployedMarkets(0);
      const BM = await hre.ethers.getContractFactory("BinaryMarket");
      market6 = BM.attach(marketAddr);

      // Mint 6-decimal tokens
      const amt = 1000n * 10n ** 6n; // 1000 USDC
      await usdc6.mint(addr1.address, amt);
      await usdc6.mint(addr2.address, amt);
    });

    it("Should handle 6-decimal token trades correctly", async function () {
      const amount = 100n * 10n ** 6n; // 100 USDC
      await usdc6.connect(addr1).approve(await market6.getAddress(), amount);
      await market6.connect(addr1).buyShares(true, amount);

      const fee = (amount * FEE_PERCENT) / DENOMINATOR;
      const net = amount - fee;

      expect(await market6.totalYesPool()).to.equal(net);
      const shares = await market6.yesShares(addr1.address);
      expect(shares).to.be.gte(net); // Time-weighted shares multiplier
    });

    it("Should allow challenge with 6-decimal bond amount", async function () {
      // Verify the bond is reasonable (500 USDC = 500_000_000 units, not 500 * 10^18)
      expect(await resolver6.minChallengeBond()).to.equal(500n * 10n ** 6n);

      const amount = 100n * 10n ** 6n;
      await usdc6.connect(addr1).approve(await market6.getAddress(), amount);
      await market6.connect(addr1).buyShares(true, amount);

      for (let i = 0; i < 21; i++) {
        await hre.network.provider.send("evm_mine", []);
      }
      await resolver6.resolveMarket(await market6.getAddress());

      // Fund challenger with bond amount
      const bond = 500n * 10n ** 6n;
      await usdc6.mint(addr2.address, bond);
      await usdc6.connect(addr2).approve(await resolver6.getAddress(), bond);

      await expect(
        resolver6.connect(addr2).challengeResolution(await market6.getAddress())
      ).to.emit(resolver6, "Challenged");
    });
  });
});
