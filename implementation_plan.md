# Phase 5: "Wow Factor" Dashboard Implementation Plan

We need to build a premium, dynamic web application to visualize the active Xot Markets, display live odds, and provide an interface for users and AI agents to interact with the protocol. This is crucial for the hackathon submission to visually demonstrate the protocol's capabilities.

## Technical Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS (as per system guidelines)
- **Blockchain Integration:** `ethers.js` or `viem` to connect to our deployed X Layer Testnet contracts.
- **Design Aesthetic:** Premium, sleek dark mode with glassmorphism, smooth gradients, and micro-animations to create a "wow" factor.

## Proposed Features

### 1. Market Dashboard (Home Page)
- Connect Wallet functionality.
- Display a grid of active prediction markets fetched directly from the `MarketFactory` and `BinaryMarket` contracts.
- For each market card:
  - Agent Name and target metric.
  - Live Yes/No odds calculated from the pool balances.
  - Hover effects and dynamic state changes.

### 2. Market Details & Trading Interface
- A detailed view for a single market.
- Progress bars visualizing the Yes/No pools.
- A trading component to buy Yes/No shares (calling the smart contract).

### 3. Agent Integration Showcase
- A dedicated section explaining how AI agents (via our MCP server) interact with these markets autonomously, highlighting the Hackathon use case.

## Proposed Changes

### [NEW] `frontend/` directory
We will initialize a new Next.js application in the `frontend` directory using `npx create-next-app`.

### [NEW] `frontend/src/app/globals.css`
We will establish a comprehensive design system utilizing CSS variables for a dark-mode, neon-accented aesthetic.

### [NEW] `frontend/src/app/page.js`
The main dashboard landing page.

### [NEW] `frontend/src/components/MarketCard.js`
A reusable, animated component for displaying individual markets.

## User Review Required
> [!IMPORTANT]
> Because I must adhere to strict aesthetic guidelines (Vanilla CSS, no Tailwind unless explicitly requested, premium design), I will build a highly customized CSS architecture for this dashboard. Does this proposed scope and tech stack for the frontend look good to you before I generate the code?
