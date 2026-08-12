# Testnet Migration & Ecosystem Integration Plan

Your team leader is absolutely right—to win a hackathon like BuildX AI Season, the project must demonstrate real on-chain activity, true Web3 frontend integration, and deep alignment with the OKX / X Layer ecosystem.

I will execute the following plan to shift the protocol from a "demo" state to a fully live, transacting X Layer protocol.

## Proposed Changes

### 1. Frontend Web3 Integration (No Mocks)
#### [MODIFY] [frontend/src/app/page.js](file:///c:/Users/Admin/Desktop/repos/agent%20odds/frontend/src/app/page.js)
#### [MODIFY] [frontend/src/components/MarketCard.js](file:///c:/Users/Admin/Desktop/repos/agent%20odds/frontend/src/components/MarketCard.js)
- We will completely remove the hardcoded `mockMarkets` array.
- We will integrate `ethers.js` on the client side. The "Connect Wallet" button will prompt the user's OKX Wallet or MetaMask to connect to the X Layer testnet.
- The dashboard will dynamically fetch the `MarketFactory` contract (at `0x4343...2e9`), iterate over the deployed markets, and read the real liquidity pools and odds directly from the blockchain.
- The "Buy YES" and "Buy NO" buttons will trigger actual Web3 transactions to approve USDC and buy shares.

### 2. On-Chain Activity Generator
#### [NEW] [scripts/seed_activity.js](file:///c:/Users/Admin/Desktop/repos/agent%20odds/scripts/seed_activity.js)
- A hackathon project with an empty contract looks dead. I will write and execute a script on the live X Layer Testnet that:
  1. Creates 3 distinct prediction markets (e.g., "Will AgentX hit $1M Volume?").
  2. Mints Mock USDC to your wallet.
  3. Automatically executes multiple "Buy YES" and "Buy NO" transactions.
- This ensures the X Layer blockchain explorer shows a rich history of transactions, and the frontend instantly has real, live data to display.

### 3. Ecosystem & OKX Alignment
#### [MODIFY] [XotMarkets_Whitepaper.md](file:///c:/Users/Admin/Desktop/repos/agent%20odds/XotMarkets_Whitepaper.md)
#### [MODIFY] [README.md](file:///c:/Users/Admin/Desktop/repos/agent%20odds/README.md)
- We will update the documentation to aggressively target the BuildX AI Season criteria.
- We will explicitly mention X Layer's high throughput and low gas fees (paid in OKB) as the core enabler for high-frequency AI agent trading.
- We will add a section outlining future integration with OKX's "Exchange OS".

## User Review Required
> [!IMPORTANT]
> Because we are removing the mock data from the frontend, the UI will only display markets that are actually deployed on the X Layer testnet. The `seed_activity.js` script will create these markets for us. Does this technical approach to migrating from "demo" to "live testnet" satisfy your team leader's review?
