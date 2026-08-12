# End-to-End User Experience Plan

Currently, the user experience allows for creating markets and trading them. However, it lacks two major components for a *complete* end-to-end hackathon experience:
1. **No Faucet:** Judges testing the live link will have an empty wallet, meaning they can't actually buy shares without running our seed scripts.
2. **No Claiming:** If a market resolves, there is no UI state showing the winner, and no button for users to actually claim their payouts. 

I propose the following changes to complete the loop.

## Proposed Changes

### 1. Embedded Faucet (UI)
#### [MODIFY] [frontend/src/app/page.js](file:///c:/Users/Admin/Desktop/repos/agent%20odds/frontend/src/app/page.js)
- We will add a "Mint 10,000 Test USDC" button to the navigation bar.
- This will allow any user (or judge) visiting the dashboard to instantly fund their wallet and start trading.

### 2. Market Lifecycle & Claiming UI
#### [MODIFY] [frontend/src/app/page.js](file:///c:/Users/Admin/Desktop/repos/agent%20odds/frontend/src/app/page.js)
#### [MODIFY] [frontend/src/components/MarketCard.js](file:///c:/Users/Admin/Desktop/repos/agent%20odds/frontend/src/components/MarketCard.js)
- The frontend will dynamically read the `finalOutcome` state of each market (PENDING, YES, NO, VOID).
- If a market is `PENDING`, the user sees the "Buy YES" and "Buy NO" buttons.
- If a market is resolved, the UI will update to show "Market Resolved: YES won" and replace the Buy buttons with a single "Claim Winnings" button.
- The "Claim Winnings" button will trigger the `claim()` function on the smart contract, paying out the user.

## User Review Required
> [!TIP]
> This completes the entire user journey: Onboarding (Faucet) -> Speculation (Trading) -> Resolution (Claiming). Does this cover everything you think is missing from the experience?
