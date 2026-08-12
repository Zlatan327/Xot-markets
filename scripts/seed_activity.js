import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log("Seeding activity with account:", deployer.address);

  const addressPath = path.join(__dirname, "../mcp-server/addresses.json");
  const addresses = JSON.parse(fs.readFileSync(addressPath, "utf8"));

  const factory = await ethers.getContractAt("MarketFactory", addresses.factory);
  const usdc = await ethers.getContractAt("MockERC20", addresses.usdc);
  
  // Mint extra USDC for trades
  console.log("Minting USDC...");
  await (await usdc.mint(deployer.address, ethers.parseEther("1000000"))).wait();

  const expiryBlock = 1000000000; // Far in the future

  // Create 3 markets
  console.log("Creating Market 1...");
  // Agent1 logic mapping
  const agent1 = "0x" + "11".repeat(20);
  let tx = await factory.createMarket(agent1, 1, expiryBlock, addresses.usdc, addresses.resolver);
  await tx.wait();

  console.log("Creating Market 2...");
  const agent2 = "0x" + "22".repeat(20);
  tx = await factory.createMarket(agent2, 2, expiryBlock, addresses.usdc, addresses.resolver);
  await tx.wait();

  console.log("Creating Market 3...");
  const agent3 = "0x" + "33".repeat(20);
  tx = await factory.createMarket(agent3, 3, expiryBlock, addresses.usdc, addresses.resolver);
  await tx.wait();

  // Fetch deployed markets
  const marketAddress1 = await factory.deployedMarkets(0);
  const marketAddress2 = await factory.deployedMarkets(1);
  const marketAddress3 = await factory.deployedMarkets(2);

  console.log("Market 1:", marketAddress1);
  console.log("Market 2:", marketAddress2);
  console.log("Market 3:", marketAddress3);

  const maxUint = ethers.MaxUint256;
  // Approve markets
  console.log("Approving USDC for Markets...");
  await (await usdc.approve(marketAddress1, maxUint)).wait();
  await (await usdc.approve(marketAddress2, maxUint)).wait();
  await (await usdc.approve(marketAddress3, maxUint)).wait();

  // Trade on Market 1
  console.log("Trading on Market 1...");
  const market1 = await ethers.getContractAt("BinaryMarket", marketAddress1);
  await (await market1.buyShares(true, ethers.parseEther("15000"))).wait();
  await (await market1.buyShares(false, ethers.parseEther("5000"))).wait();

  // Trade on Market 2
  console.log("Trading on Market 2...");
  const market2 = await ethers.getContractAt("BinaryMarket", marketAddress2);
  await (await market2.buyShares(false, ethers.parseEther("30000"))).wait();
  await (await market2.buyShares(true, ethers.parseEther("10000"))).wait();

  // Trade on Market 3
  console.log("Trading on Market 3...");
  const market3 = await ethers.getContractAt("BinaryMarket", marketAddress3);
  await (await market3.buyShares(true, ethers.parseEther("25000"))).wait();
  await (await market3.buyShares(false, ethers.parseEther("25000"))).wait();

  console.log("Seeding complete! On-chain history generated.");
}

main().catch(console.error);
