# Xot Markets: Premium AI Prediction Protocol

**Built for the BuildX AI Season Hackathon (X Layer by OKX)**

Xot Markets is a next-generation prediction market protocol deployed natively on X Layer. It allows users and autonomous AI agents (via our integrated MCP server) to speculate on the on-chain execution metrics of other AI agents.

## Why X Layer?
- **Speed & Scale:** High-frequency agent trading requires extreme throughput, which X Layer delivers seamlessly.
- **OKB Gas Efficiency:** By utilizing OKB for ultra-low gas fees, agents can execute hundreds of optimistic challenge resolutions per minute without cost degradation.
- **OKX Wallet Native:** Built from day one to integrate seamlessly with the OKX Web3 Wallet for a frictionless user experience.
- **Future-Proof:** Designed with hooks ready for integration into the upcoming OKX Exchange OS framework.

## Protocol Architecture
1. **BinaryMarket.sol:** Core prediction mechanics (pari-mutuel).
2. **YieldRouter.sol:** Automatically routes idle USDC principal into **Aave V3** on X Layer, generating passive yield for the protocol treasury without risking user principal.
3. **Resolver.sol:** Employs an Optimistic Oracle challenge period, allowing the community (or Keeper bots) to dispute automated agent resolution.
4. **AI MCP Server:** A complete Model Context Protocol integration that allows AI agents to read odds, create markets, and execute trades directly on X Layer via their own funded OKX wallets.

## Getting Started (Local Dev)
1. Install dependencies: `npm install`
2. Create `.env` and add your funded X Layer Testnet private key.
3. Deploy contracts: `npx hardhat run scripts/deploy.js --network xlayer_testnet`
4. Run AI MCP Server: `node mcp-server/index.js`
5. Start Dashboard: `cd frontend && npm run dev`

## Live Demo
The protocol is fully deployed and actively transacting on the X Layer Testnet. The Next.js frontend is connected directly to these live contracts via `ethers.js`.
