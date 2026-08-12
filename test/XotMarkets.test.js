import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Xot Markets Protocol", function () {
  let mockToken, agentRegistry, reputationEngine, resolver, factory, binaryMarket, aaveMock, yieldRouter;
  let owner, addr1, addr2, addr3, arbitrationCouncil, prizeVault;
  let targetAgent;
  const FEE_PERCENT = 150n; // 1.5%
  const DENOMINATOR = 10000n;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, arbitrationCouncil, prizeVault, targetAgent] = await hre.ethers.getSigners();

    // Deploy Mocks
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("USD Coin", "USDC");

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
      arbitrationCouncil.address
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
    const expiryBlock = currentBlock + 10;
    
    await factory.createMarket(
      targetAgent.address,
      0, // Metric: Volume
      expiryBlock,
      await mockToken.getAddress(),
      await resolver.getAddress()
    );

    const marketAddress = await factory.deployedMarkets(0);
    const BinaryMarket = await hre.ethers.getContractFactory("BinaryMarket");
    binaryMarket = BinaryMarket.attach(marketAddress);

    await resolver.setVolumeThreshold(marketAddress, 5000); 
  });

  it("Should calculate pari-mutuel payouts correctly on YES win", async function () {
    const amount1 = hre.ethers.parseEther("100");
    await mockToken.connect(addr1).approve(await binaryMarket.getAddress(), amount1);
    await binaryMarket.connect(addr1).buyShares(true, amount1);

    const amount2 = hre.ethers.parseEther("300");
    await mockToken.connect(addr2).approve(await binaryMarket.getAddress(), amount2);
    await binaryMarket.connect(addr2).buyShares(false, amount2);

    for(let i = 0; i < 11; i++) {
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
});
