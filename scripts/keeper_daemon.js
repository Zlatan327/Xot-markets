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

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/src/lib/addresses.json"), "utf8"));
const factoryAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/MarketFactory.sol/MarketFactory.json"), "utf8")).abi;
const marketAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/BinaryMarket.sol/BinaryMarket.json"), "utf8")).abi;
const resolverAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/Resolver.sol/Resolver.json"), "utf8")).abi;

const factory = new ethers.Contract(addresses.factory, factoryAbi, wallet);
const resolver = new ethers.Contract(addresses.resolver, resolverAbi, wallet);

// Known agent catalog for autonomous epoch creation
const AGENT_CATALOG = [
  { agent: "0x1111111111111111111111111111111111111111", metricType: 1, threshold: 10000000 },
  { agent: "0x2222222222222222222222222222222222222222", metricType: 2, threshold: 25 },
  { agent: "0x3333333333333333333333333333333333333333", metricType: 3, threshold: 5000 },
  { agent: "0x5555555555555555555555555555555555555555", metricType: 1, threshold: 5000000 },
  { agent: "0x6666666666666666666666666666666666666666", metricType: 2, threshold: 35 },
  { agent: "0x7777777777777777777777777777777777777777", metricType: 3, threshold: 25000 },
  { agent: "0x8888888888888888888888888888888888888888", metricType: 1, threshold: 2000000 }
];

async function checkAndAutoSettleMarkets() {
  console.log("\n[Keeper] Checking markets for auto-settlement...");
  const currentBlock = await provider.getBlockNumber();
  console.log(`[Keeper] Current X Layer Block: ${currentBlock}`);

  for (let i = 0; i < 50; i++) {
    let marketAddr;
    try {
      marketAddr = await factory.deployedMarkets(i);
    } catch {
      break;
    }

    try {
      const market = new ethers.Contract(marketAddr, marketAbi, provider);
      const [expiryBlock, outcome] = await Promise.all([
        market.expiryBlock(),
        market.finalOutcome()
      ]);

      // If market is expired and still pending outcome (0)
      if (currentBlock >= expiryBlock && Number(outcome) === 0) {
        console.log(`[Keeper] Market ${i} (${marketAddr}) has EXPIRED. Triggering auto-resolution...`);
        
        try {
          const tx = await resolver.resolveMarket(marketAddr);
          console.log(`[Keeper] Resolution Tx sent: ${tx.hash}`);
          await tx.wait();
          console.log(`[Keeper] Market ${marketAddr} auto-resolved successfully!`);
        } catch (resErr) {
          console.log(`[Keeper] Auto-resolution info: ${resErr.reason || resErr.message}`);
        }
      }
    } catch (e) {
      console.error(`[Keeper] Error processing market ${i}:`, e.message);
    }
  }
}

async function startKeeper() {
  console.log("==================================================");
  console.log("  XOT MARKETS AUTONOMOUS KEEPER DAEMON");
  console.log("  Monitoring X Layer Testnet for Auto-Creation & Settle");
  console.log("  Keeper Wallet:", wallet.address);
  console.log("==================================================");

  // Run on startup
  await checkAndAutoSettleMarkets();

  // Run periodic loop every 60 seconds
  setInterval(async () => {
    try {
      await checkAndAutoSettleMarkets();
    } catch (e) {
      console.error("[Keeper Error]", e);
    }
  }, 60000);
}

startKeeper().catch(console.error);
