import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const addressesPath = path.join(process.cwd(), "frontend", "src", "lib", "addresses.json");
const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
const factoryArtifact = JSON.parse(fs.readFileSync(path.join(process.cwd(), "artifacts", "contracts", "MarketFactory.sol", "MarketFactory.json"), "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testrpc.xlayer.tech");
  const factory = new ethers.Contract(addresses.factory, factoryArtifact.abi, provider);

  const allMarkets = [];
  try {
    const count = Number(await factory.getMarketCount());
    for (let i = 0; i < count; i++) {
      const marketAddr = await factory.deployedMarkets(i);
      allMarkets.push(marketAddr);
    }
  } catch (e) {
    console.error("Error fetching market count:", e.message);
  }

  console.log(`Found ${allMarkets.length} deployed markets on MarketFactory:`);
  console.log(allMarkets);

  addresses.markets = allMarkets;
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Updated addresses.json successfully!");
}

main().catch(console.error);
