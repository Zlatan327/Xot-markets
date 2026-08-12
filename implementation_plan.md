# Security Audit & Architecture Fix Plan

I have deeply audited the core smart contracts (`BinaryMarket.sol`, `Resolver.sol`, and `YieldRouter.sol`) and discovered **one critical manipulation vulnerability** and **one major Denial-of-Service (DoS) vector**.

## Proposed Changes

### 1. Fix Critical Exploitation Vector (Resolver Manipulation)
**The Bug:** In `Resolver.sol`, the function `setVolumeThreshold` has NO access control. This means an attacker can wait until a market is about to resolve, call `setVolumeThreshold(market, 0)` to guarantee the condition evaluates to `YES`, and steal the payouts. 
**The Fix:** 
- [MODIFY] `contracts/BinaryMarket.sol`: Add `uint256 public metricThreshold` to the market state, set immutably in the constructor.
- [MODIFY] `contracts/MarketFactory.sol`: Update `createMarket` to accept the threshold at the time of creation.
- [MODIFY] `contracts/Resolver.sol`: Remove the vulnerable `setVolumeThreshold` mapping. Have the resolver natively fetch the immutable threshold directly from the market contract (`market.metricThreshold()`).

### 2. Fix Denial of Service (Locked Aave Funds)
**The Bug:** If the `YieldRouter` invests market principal into Aave, those funds must be explicitly withdrawn by the protocol owner before users can `claim()` their winnings. If the owner goes offline (or forgets to withdraw), the winners' payouts are permanently locked inside Aave, breaking the protocol.
**The Fix:**
- [MODIFY] `contracts/BinaryMarket.sol`: Add an `emergencyWithdrawFromAave()` function. This will allow ANY user to pull the funds out of Aave and back into the market contract *only if* the market has been resolved (`finalOutcome != PENDING`), guaranteeing winners can always claim their funds trustlessly.

### 3. MCP Server & Frontend Alignment
**The Bug:** The frontend and MCP server currently do not pass or read dynamic thresholds (e.g. hardcoding "Volume > 10M" in the UI).
**The Fix:**
- [MODIFY] `mcp-server/index.js`: Update the `create_market` tool to require a `metricThreshold`.
- [MODIFY] `frontend/src/app/page.js`: Update the UI to dynamically read and format the `metricThreshold` directly from the blockchain (e.g., displaying exactly what condition must be met).
- [NEW] Write a shell script to re-compile, re-deploy the fixed contracts, update ABIs, and re-run the seed script to reset the blockchain to a secure state.

## User Review Required
> [!CAUTION]
> This patch requires re-deploying the smart contracts. This is standard procedure for fixing severe vulnerabilities during a hackathon. Does this architectural fix look good to you?
