import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log("Creating resolved market with account:", deployer.address);

  const addressPath = path.join(__dirname, "../mcp-server/addresses.json");
  const addresses = JSON.parse(fs.readFileSync(addressPath, "utf8"));

  const factory = await ethers.getContractAt("MarketFactory", addresses.factory);
  const usdc = await ethers.getContractAt("MockERC20", addresses.usdc);
  const resolver = await ethers.getContractAt("Resolver", addresses.resolver);
  
  const currentBlock = await ethers.provider.getBlockNumber();
  const expiryBlock = currentBlock + 3; 

  console.log("Creating Market 4 (Short Expiry)...");
  const agent4 = "0x" + "44".repeat(20);
  let tx = await factory.createMarket(agent4, 1, 0, expiryBlock, addresses.usdc, addresses.resolver);
  await tx.wait();

  const marketAddress4 = await factory.deployedMarkets(3);
  console.log("Market 4:", marketAddress4);

  console.log("Trading on Market 4...");
  await (await usdc.approve(marketAddress4, ethers.MaxUint256)).wait();
  const market4 = await ethers.getContractAt("BinaryMarket", marketAddress4);
  await (await market4.buyShares(true, ethers.parseEther("50000"))).wait();
  
  console.log("Mining blocks to reach expiry...");
  for(let i=0; i<4; i++) {
     await (await usdc.approve(addresses.factory, 0)).wait(); 
  }

  console.log("Resolving Market 4...");
  await (await resolver.resolveMarket(marketAddress4)).wait();

  console.log("Market 4 resolved! Check the dashboard to claim winnings.");
}

main().catch(console.error);
