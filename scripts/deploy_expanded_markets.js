import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const addressesPath = path.join(process.cwd(), "frontend", "src", "lib", "addresses.json");
const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

const factoryArtifact = JSON.parse(fs.readFileSync(path.join(process.cwd(), "artifacts", "contracts", "MarketFactory.sol", "MarketFactory.json"), "utf8"));
const marketArtifact = JSON.parse(fs.readFileSync(path.join(process.cwd(), "artifacts", "contracts", "BinaryMarket.sol", "BinaryMarket.json"), "utf8"));
const usdcArtifact = JSON.parse(fs.readFileSync(path.join(process.cwd(), "artifacts", "contracts", "mocks", "MockERC20.sol", "MockERC20.json"), "utf8"));

const newAgentMarketsToDeploy = [
  {
    agentAddress: "0x9999999999999999999999999999999999999999",
    name: "Truth Terminal Alpha",
    metricType: 1, // Volume
    threshold: 1500000,
    seedYes: 28000,
    seedNo: 12000 // 70% YES (70¢)
  },
  {
    agentAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    name: "Virtuals Yield Bot",
    metricType: 2, // APY
    threshold: 28,
    seedYes: 22500,
    seedNo: 7500 // 75% YES (75¢)
  },
  {
    agentAddress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    name: "Luna Autonomous Sentinel",
    metricType: 1, // Volume
    threshold: 2000000,
    seedYes: 18000,
    seedNo: 12000 // 60% YES (60¢)
  },
  {
    agentAddress: "0xcccccccccccccccccccccccccccccccccccccccc",
    name: "Spectral Arbitrage Solver",
    metricType: 1, // Volume
    threshold: 3500000,
    seedYes: 32000,
    seedNo: 8000 // 80% YES (80¢)
  },
  {
    agentAddress: "0xdddddddddddddddddddddddddddddddddddddddd",
    name: "Vader Market Maker",
    metricType: 3, // Executions/Fills
    threshold: 50000,
    seedYes: 24000,
    seedNo: 16000 // 60% YES (60¢)
  },
  {
    agentAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    name: "Freysa Autonomous Oracle",
    metricType: 3, // Consensus Queries
    threshold: 20000,
    seedYes: 36000,
    seedNo: 4000 // 90% YES (90¢)
  },
  {
    agentAddress: "0xffffffffffffffffffffffffffffffffffffffff",
    name: "CoW Intent Solver Agent",
    metricType: 1, // Intent Volume
    threshold: 5000000,
    seedYes: 27000,
    seedNo: 13000 // 67.5% YES (68¢)
  },
  {
    agentAddress: "0x1010101010101010101010101010101010101010",
    name: "Fortress Invariant Guardian",
    metricType: 1, // Guarded TVL
    threshold: 50000000,
    seedYes: 38000,
    seedNo: 2000 // 95% YES (95¢)
  }
];

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testrpc.xlayer.tech");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("=== EXPANDING MARKETS FOR ACTIVE AI AGENTS ON X LAYER ===");
  console.log("Deployer Wallet:", wallet.address);

  const factory = new ethers.Contract(addresses.factory, factoryArtifact.abi, wallet);
  const usdc = new ethers.Contract(addresses.usdc, usdcArtifact.abi, wallet);

  // Mint USDC for initial market seeding
  const totalFundingNeeded = newAgentMarketsToDeploy.reduce((sum, m) => sum + m.seedYes + m.seedNo, 0);
  console.log(`Minting $${totalFundingNeeded.toLocaleString()} USDC for market seeding...`);
  const mintTx = await usdc.mint(wallet.address, ethers.parseUnits(totalFundingNeeded.toString(), 18));
  await mintTx.wait();
  console.log("USDC Mint confirmed!");

  const currentBlock = await provider.getBlockNumber();
  const expiryBlock = currentBlock + 200000; // ~4-5 days of blocks

  const deployedMarkets = [...(addresses.markets || [])];

  for (let i = 0; i < newAgentMarketsToDeploy.length; i++) {
    const item = newAgentMarketsToDeploy[i];
    console.log(`\n[${i + 1}/${newAgentMarketsToDeploy.length}] Deploying market for ${item.name} (${item.agentAddress})...`);
    
    // 1. Create onchain market via factory
    const tx = await factory.createMarket(
      item.agentAddress,
      item.metricType,
      item.threshold,
      expiryBlock,
      addresses.usdc,
      addresses.resolver
    );
    const receipt = await tx.wait();
    
    // Find MarketCreated event
    let marketAddress = null;
    for (const log of receipt.logs) {
      try {
        const parsed = factory.interface.parseLog(log);
        if (parsed && parsed.name === "MarketCreated") {
          marketAddress = parsed.args.marketAddress || parsed.args.market || parsed.args[0];
          break;
        }
      } catch (err) {}
    }

    if (!marketAddress) {
      console.error(`Could not parse market address for ${item.name}`);
      continue;
    }

    console.log(`✓ Market deployed at: ${marketAddress}`);
    deployedMarkets.push(marketAddress);

    // 2. Fund initial seed liquidity
    const marketContract = new ethers.Contract(marketAddress, marketArtifact.abi, wallet);
    
    // Approve USDC
    const totalMarketSeed = ethers.parseUnits((item.seedYes + item.seedNo).toString(), 18);
    const approveTx = await usdc.approve(marketAddress, totalMarketSeed);
    await approveTx.wait();

    // Buy YES
    const yesTx = await marketContract.buyShares(1, ethers.parseUnits(item.seedYes.toString(), 18));
    await yesTx.wait();

    // Buy NO
    const noTx = await marketContract.buyShares(2, ethers.parseUnits(item.seedNo.toString(), 18));
    await noTx.wait();

    console.log(`  Seeded $${item.seedYes} YES / $${item.seedNo} NO liquidity.`);
  }

  // Update addresses.json
  addresses.markets = deployedMarkets;
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("\n✅ All expanded markets deployed & addresses.json updated!");
  console.log(`Total Active Onchain Markets: ${deployedMarkets.length}`);
}

main().catch(console.error);
