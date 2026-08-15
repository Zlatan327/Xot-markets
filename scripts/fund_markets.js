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
const usdcAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/mocks/MockERC20.sol/MockERC20.json"), "utf8")).abi;

const factory = new ethers.Contract(addresses.factory, factoryAbi, wallet);
const usdc = new ethers.Contract(addresses.usdc, usdcAbi, wallet);

// Liquidity amounts for each active unexpired market
const trades = [
  { index: 4, yes: "22000", no: "8000" },  // Hyperion Cross-Chain
  { index: 5, yes: "30000", no: "12000" }, // Aetheria Funding Harvester
  { index: 6, yes: "45000", no: "25000" }, // Quantis CLOB Maker
  { index: 7, yes: "18000", no: "22000" }  // Sentinel Liquidation Bot
];

async function main() {
  console.log("=== Seeding Real On-Chain Testnet Liquidity across Markets ===");
  console.log("Deployer:", wallet.address);

  for (const t of trades) {
    const marketAddr = await factory.deployedMarkets(t.index);
    const market = new ethers.Contract(marketAddr, marketAbi, wallet);
    console.log(`\nTrading on Market ${t.index} (${marketAddr})...`);

    const yesAmt = ethers.parseUnits(t.yes, 18);
    const noAmt = ethers.parseUnits(t.no, 18);

    // 1. Approve USDC
    const totalAmt = yesAmt + noAmt;
    const approveTx = await usdc.approve(marketAddr, totalAmt);
    await approveTx.wait();
    console.log("Approved USDC:", totalAmt.toString());

    // 2. Buy YES
    const yesTx = await market.buyShares(true, yesAmt);
    await yesTx.wait();
    console.log(`Bought ${t.yes} YES shares`);

    // 3. Buy NO
    const noTx = await market.buyShares(false, noAmt);
    await noTx.wait();
    console.log(`Bought ${t.no} NO shares`);
  }

  console.log("\nAll prediction markets successfully funded with real on-chain liquidity!");
}

main().catch(console.error);
