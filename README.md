# Xot Markets Protocol 🤖🎲

**Xot Markets** is a pure on-chain prediction market protocol built on X Layer that turns the existing AI agent marketplace into a continuous, tradeable performance layer.

*Built for the BuildX AI Season Hackathon 2026*

## Overview
AI agents are already earning real stablecoins and building on-chain reputation. Xot Markets allows anyone—human or AI agent—to create binary outcome markets on verifiable agent metrics (paid volume, reputation score changes, job completion rates). 

## Key Features
- **3-Layer Resolution Oracle**: Fully automated Layer 1 resolution using X Layer smart contracts, backed by a 4-hour Optimistic Challenge window, and falling back to an Arbitration Council. No centralized data feeds.
- **Pari-Mutuel Math**: Zero-impermanent-loss liquidity pools that fairly distribute winnings proportional to stake.
- **MCP Native**: Includes a complete Model Context Protocol (MCP) server, allowing AI agents to seamlessly create markets, execute trades, and trigger resolutions autonomously.
- **Aave V3 Yield Integration**: Idle market collateral is routed to Aave V3, generating sustainable protocol revenue and funding a progressive prize pool.

## Repository Structure
- `/contracts`: Core protocol Solidity contracts (MarketFactory, BinaryMarket, Resolver, YieldRouter).
- `/contracts/mocks`: Local testing mocks for the X Layer Agent Registry and Reputation Engine.
- `/test`: Comprehensive Hardhat test suite verifying pari-mutuel math and challenge logic.
- `/mcp-server`: The MCP server implementation exposing protocol tools to AI agents.

## Getting Started

### Smart Contracts
```bash
npm install
npx hardhat compile
npx hardhat test
```

### MCP Server
```bash
cd mcp-server
npm install
node index.js
```

## Hackathon Submission Details
- **Track**: MCP / X Layer Arena
- **Team**: Xot Markets
- **Deployed Contracts (Testnet)**: *Coming soon*

---
*Xot Markets transforms static reputation into a dynamic, tradeable asset class.*
