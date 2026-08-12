import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new Server(
  {
    name: "Xot Markets-MCP",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const rpcUrl = process.env.RPC_URL || "https://testrpc.xlayer.tech";
const provider = new ethers.JsonRpcProvider(rpcUrl);

let wallet;
if (process.env.AGENT_PRIVATE_KEY) {
  wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
} else {
  wallet = ethers.Wallet.createRandom().connect(provider);
}

function getAddresses() {
  const addressPath = path.join(__dirname, "addresses.json");
  if (!fs.existsSync(addressPath)) {
    throw new Error("Addresses file not found. Please deploy contracts first.");
  }
  return JSON.parse(fs.readFileSync(addressPath, "utf8"));
}

function getAbi(contractName) {
  let subPath = contractName;
  // Handle mocks if needed, but normally just the contract name
  if (contractName === "MockERC20") subPath = "mocks/MockERC20";
  const artifactPath = path.join(__dirname, `../artifacts/contracts/${subPath}.sol/${contractName}.json`);
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")).abi;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_markets",
        description: "Returns a list of all active Xot Markets prediction markets and their contract addresses.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "get_market_details",
        description: "Gets the current odds, pool size, and status of a specific market.",
        inputSchema: {
          type: "object",
          properties: { marketAddress: { type: "string" } },
          required: ["marketAddress"]
        }
      },
      {
        name: "create_market",
        description: "Creates a new prediction market. Requires testnet funds.",
        inputSchema: {
          type: "object",
          properties: {
            agent: { type: "string" },
            metricType: { type: "number" },
            metricThreshold: { type: "number" },
            expiryBlock: { type: "number" }
          },
          required: ["agent", "metricType", "metricThreshold", "expiryBlock"]
        }
      },
      {
        name: "trade",
        description: "Buys YES or NO shares in a market. Requires USDC.",
        inputSchema: {
          type: "object",
          properties: {
            marketAddress: { type: "string" },
            isYes: { type: "boolean" },
            amountEther: { type: "string" }
          },
          required: ["marketAddress", "isYes", "amountEther"]
        }
      },
      {
        name: "resolve",
        description: "Triggers auto-resolution for an expired market.",
        inputSchema: {
          type: "object",
          properties: { marketAddress: { type: "string" } },
          required: ["marketAddress"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const addresses = getAddresses();
  
  switch (request.params.name) {
    case "get_markets": {
      const factory = new ethers.Contract(addresses.factory, getAbi("MarketFactory"), provider);
      // Hackathon MVP: Just brute force array retrieval (not for production)
      let markets = [];
      try {
        for (let i = 0; i < 50; i++) {
          markets.push(await factory.deployedMarkets(i));
        }
      } catch (e) {
        // Will throw when out of bounds
      }
      return { content: [{ type: "text", text: JSON.stringify(markets) }] };
    }
    
    case "get_market_details": {
      const market = new ethers.Contract(request.params.arguments.marketAddress, getAbi("BinaryMarket"), provider);
      const targetAgent = await market.targetAgent();
      const expiryBlock = await market.expiryBlock();
      const totalYes = await market.totalYesPool();
      const totalNo = await market.totalNoPool();
      const outcome = await market.finalOutcome();
      return { 
        content: [{ type: "text", text: JSON.stringify({ targetAgent, expiryBlock: Number(expiryBlock), totalYes: ethers.formatEther(totalYes), totalNo: ethers.formatEther(totalNo), outcome: Number(outcome) }, null, 2) }] 
      };
    }

    case "create_market": {
      const factory = new ethers.Contract(addresses.factory, getAbi("MarketFactory"), wallet);
      try {
        const tx = await factory.createMarket(
          request.params.arguments.agent,
          request.params.arguments.metricType,
          request.params.arguments.metricThreshold,
          request.params.arguments.expiryBlock,
          addresses.usdc,
          addresses.resolver
        );
        const receipt = await tx.wait();
        return { content: [{ type: "text", text: `Market created successfully. Tx: ${receipt.hash}` }] };
      } catch (e) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }] };
      }
    }

    case "trade": {
      const market = new ethers.Contract(request.params.arguments.marketAddress, getAbi("BinaryMarket"), wallet);
      const usdc = new ethers.Contract(addresses.usdc, getAbi("MockERC20"), wallet);
      const amount = ethers.parseEther(request.params.arguments.amountEther);
      
      try {
        // Approve first
        const approveTx = await usdc.approve(request.params.arguments.marketAddress, amount);
        await approveTx.wait();
        
        // Trade
        const tx = await market.buyShares(request.params.arguments.isYes, amount);
        const receipt = await tx.wait();
        return { content: [{ type: "text", text: `Trade executed. Tx: ${receipt.hash}` }] };
      } catch (e) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }] };
      }
    }

    case "resolve": {
      const resolver = new ethers.Contract(addresses.resolver, getAbi("Resolver"), wallet);
      try {
        const tx = await resolver.resolveMarket(request.params.arguments.marketAddress);
        const receipt = await tx.wait();
        return { content: [{ type: "text", text: `Resolution triggered. Tx: ${receipt.hash}` }] };
      } catch (e) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }] };
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Xot Markets MCP server connected via stdio");
}

main().catch(console.error);
