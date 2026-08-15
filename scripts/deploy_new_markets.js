import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rpcUrl = "https://testrpc.xlayer.tech";
const provider = new ethers.JsonRpcProvider(rpcUrl);

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("PRIVATE_KEY missing in .env");
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);

// Load artifacts and addresses
const addresses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../frontend/src/lib/addresses.json"), "utf8")
);
const factoryArtifact = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../artifacts/contracts/MarketFactory.sol/MarketFactory.json"), "utf8")
);
const marketArtifact = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../artifacts/contracts/BinaryMarket.sol/BinaryMarket.json"), "utf8")
);
const usdcArtifact = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../artifacts/contracts/mocks/MockERC20.sol/MockERC20.json"), "utf8")
);

const factory = new ethers.Contract(addresses.factory, factoryArtifact.abi, wallet);
const usdc = new ethers.Contract(addresses.usdc, usdcArtifact.abi, wallet);

// 4 New Real Agent Markets to deploy on-chain
const newMarkets = [
  {
    agent: "0x5555555555555555555555555555555555555555",
    metricType: 1, // Volume
    metricThreshold: 5000000, // $5,000,000 Volume
    initialYes: "12000",
    initialNo: "8000"
  },
  {
    agent: "0x6666666666666666666666666666666666666666",
    metricType: 2, // APY
    metricThreshold: 35, // 35% APY
    initialYes: "18500",
    initialNo: "6500"
  },
  {
    agent: "0x7777777777777777777777777777777777777777",
    metricType: 3, // Executions
    metricThreshold: 25000, // 25,000 Orders
    initialYes: "32000",
    initialNo: "14000"
  },
  {
    agent: "0x8888888888888888888888888888888888888888",
    metricType: 1, // Volume
    metricThreshold: 2000000, // $2,000,000 Liquidated
    initialYes: "15000",
    initialNo: "22000"
  }
];

async function main() {
  console.log("=== Deploying New Real On-Chain Prediction Markets on X Layer Testnet ===");
  console.log("Deployer Address:", wallet.address);
  
  const currentBlock = await provider.getBlockNumber();
  console.log("Current Block Number:", currentBlock);
  const expiryBlock = currentBlock + 200000; // ~4-5 days of blocks

  for (let i = 0; i < newMarkets.length; i++) {
    const m = newMarkets[i];
    console.log(`\nDeploying Market ${i + 1}/4 for Target Agent: ${m.agent}...`);
    
    // 1. Create Market in Factory
    const tx = await factory.createMarket(
      m.agent,
      m.metricType,
      m.metricThreshold,
      expiryBlock,
      addresses.usdc,
      addresses.resolver
    );
    console.log("Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Market deployed successfully! Gas used:", receipt.gasUsed.toString());

    // Get the newly created market address from factory
    const totalDeployed = await factory.deployedMarkets.length;
  }

  console.log("\nAll 4 new prediction markets successfully created on-chain!");
}

main().catch((err) => {
  console.error("Failed to deploy markets:", err);
  process.exit(1);
});
