import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy Mocks (For Testnet MVP)
  console.log("\n--- Deploying Mocks ---");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const usdc = await MockERC20.deploy("Test USDC", "USDC");
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("Mock USDC deployed to:", usdcAddress);

  const AgentRegistryMock = await hre.ethers.getContractFactory("AgentRegistryMock");
  const registry = await AgentRegistryMock.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("AgentRegistryMock deployed to:", registryAddress);

  const ReputationEngineMock = await hre.ethers.getContractFactory("ReputationEngineMock");
  const reputation = await ReputationEngineMock.deploy();
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("ReputationEngineMock deployed to:", reputationAddress);

  const AavePoolMock = await hre.ethers.getContractFactory("AavePoolMock");
  const aave = await AavePoolMock.deploy();
  await aave.waitForDeployment();
  const aaveAddress = await aave.getAddress();
  console.log("AavePoolMock deployed to:", aaveAddress);

  // 2. Deploy YieldRouter
  console.log("\n--- Deploying YieldRouter ---");
  const YieldRouter = await hre.ethers.getContractFactory("YieldRouter");
  const yieldRouter = await YieldRouter.deploy(usdcAddress, deployer.address);
  await yieldRouter.waitForDeployment();
  const yieldRouterAddress = await yieldRouter.getAddress();
  console.log("YieldRouter deployed to:", yieldRouterAddress);

  // 3. Deploy MarketFactory
  console.log("\n--- Deploying MarketFactory ---");
  const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
  const factory = await MarketFactory.deploy(deployer.address, aaveAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("MarketFactory deployed to:", factoryAddress);

  // Link Factory to YieldRouter
  await factory.setYieldRouter(yieldRouterAddress);
  console.log("MarketFactory linked to YieldRouter");

  // 4. Deploy Resolver
  console.log("\n--- Deploying Resolver ---");
  const Resolver = await hre.ethers.getContractFactory("Resolver");
  const resolver = await Resolver.deploy(
    registryAddress,
    reputationAddress,
    deployer.address // Arbitration Council
  );
  await resolver.waitForDeployment();
  const resolverAddress = await resolver.getAddress();
  console.log("Resolver deployed to:", resolverAddress);

  const addresses = {
    usdc: usdcAddress,
    factory: factoryAddress,
    resolver: resolverAddress,
    yieldRouter: yieldRouterAddress
  };
  
  console.log("Save these addresses for your MCP Server configuration:");
  console.log(addresses);

  const mcpDir = path.join(__dirname, "../mcp-server");
  if (!fs.existsSync(mcpDir)) {
    fs.mkdirSync(mcpDir);
  }
  fs.writeFileSync(
    path.join(mcpDir, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
  console.log("Addresses saved to mcp-server/addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
