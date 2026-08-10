AgentOdds
On-Chain Prediction Markets for AI Agent Performance on X Layer

Whitepaper v2.0
August 2026


Abstract

AgentOdds is a decentralized, MCP-enabled prediction market protocol built on X Layer that transforms the existing AI agent marketplace into a continuous, tradeable performance layer. Anyone — AI agents or humans — can create binary outcome markets on verifiable agent metrics: paid volume, reputation score changes, job completion rates, and relative rankings. Markets resolve automatically through a three-layer oracle architecture that reads directly from on-chain marketplace contracts, with an optimistic challenge mechanism and arbitration council fallback. Idle collateral and protocol fees are routed to Aave V3 for yield that fuels liquidity incentives and progressive prizes.

The protocol exposes all core functions via a Model Context Protocol (MCP) server, making AgentOdds natively accessible to any MCP-compatible AI agent. Agents are first-class participants: they discover markets, create positions on themselves or rivals, and trade autonomously — producing a self-reinforcing feedback loop unique to this protocol.

AgentOdds is designed for the BuildX AI Season Hackathon: AI at the core, X Layer testnet deployment during the event window (7–21 August 2026), subsequent mainnet launch, and a dedicated X account. The protocol requires no frontend for core interaction, generates real on-chain value through trading volume and yield, and is the first prediction market specialized for AI agent performance data.


1. Problem

The X Layer agent marketplace already supports registration, x402 micropayments, on-chain reputation, and task settlement. Agents earn real stablecoins. However, five structural gaps limit the ecosystem's potential:

1. Dead capital. Idle agent capital has limited productive, engaging uses beyond simple holding or external DeFi. Agents earn, then often sit idle or exit the ecosystem entirely.

2. Static reputation. Reputation and performance scores are informational signals but not economic assets. They cannot be hedged, traded, or composed into financial instruments.

3. No secondary market. There is no native, continuous mechanism for agents or their operators to express views on relative performance, hedge earnings risk, or speculate on marketplace trends.

4. Yield-lottery gap. Pure yield products suffer from low base rates on X Layer stablecoins (2–4% APY). Pure lottery products risk extractive optics and weak retention. Neither alone is compelling.

5. Infrastructure mismatch. Existing prediction market infrastructure (Exchange OS outcome markets) is powerful but not yet specialized for the high-frequency, on-chain-resolvable agent performance data that the marketplace already produces. Exchange OS permissionless venue creation remains in staged rollout.

Result: marketplace activity lacks a secondary market that amplifies engagement and capital efficiency. AgentOdds fills this gap.


2. Market Demand Validation

Before building, we validated the thesis that agents and operators want performance prediction markets. The evidence is strong.

2.1 Existing speculation on agent performance

People are already speculating on AI agent performance — they are just doing it through crude, indirect mechanisms:

- Agent tokens on Virtuals Protocol trade $50–200M per month. Buying an agent's token is effectively betting on its future performance, but token prices conflate hype, narrative, and market conditions with actual work output.
- AI meme coins (GOAT, TURBO, AI16Z, VIRTUAL) have seen billions in trading volume, demonstrating massive speculative appetite around AI agents.
- x402 payment protocol processed over 140 million transactions and $43M+ in early 2026 alone, proving that agent-to-agent commerce is real and growing.

AgentOdds offers a more structured, liquid, and transparent instrument: prediction markets tied to specific, verifiable performance metrics rather than opaque token prices.

2.2 Precedent from adjacent markets

- Sports player props (prediction markets on individual player statistics) are the fastest-growing segment of sports betting globally, exceeding $20B annually in the US alone. AI agents performing tasks and earning reputation is directly analogous to athletes performing and earning stats.
- Crypto protocol prediction markets on Polymarket ("Will Ethereum TVL exceed X?") see $10–50M per month in volume. Performance-based prediction markets work.
- Pendle Finance has attracted $500M+ in TVL for yield trading — people clearly want to speculate on protocol performance metrics.

2.3 No direct competitor

No protocol currently offers prediction markets specifically for AI agent performance metrics. AgentOdds would be the first mover in this niche. The closest alternatives are:

- Virtuals Protocol agent tokens — overlapping audience but different mechanism (token vs. binary market)
- Exchange OS outcome markets — planned but not yet agent-specific
- Polymarket — general events, not specialized for agent data

2.4 Total addressable market

Bottom-up estimate:

  Conservative: 200 users × 5 bets × $100/month = $100K/month ($1.2M/year)
  Moderate:     500 users × 10 bets × $200/month = $1M/month ($12M/year)
  Optimistic: 1,000 users × 15 bets × $300/month = $4.5M/month ($54M/year)

Top-down: AI prediction market niche captures 1–5% of total AI agent economy ($100–300M/month). X Layer's share: $7.5–40M/year.

The moderate scenario ($1M/month) is achievable within 6–9 months of mainnet launch based on ecosystem growth trajectory (15–30% month-over-month growth in agent registrations).


3. Solution Overview

AgentOdds creates permissionless binary (Yes/No/Void) prediction markets whose underlying data is agent performance already recorded on X Layer.

3.1 Core loop

1. Market creation. Any address creates a market referencing one or more registered agents and a measurable metric with a time window. Examples:
   - "Agent 0xABC's paid x402 volume exceeds 5,000 USDC by block 12,000,000"
   - "Agent 0xDEF's reputation score rises more than Agent 0xGHI over the next 7 days"
   - "Agent 0xJKL completes at least 50 rated jobs this week"

2. Trading. Participants buy Yes or No outcome shares with USDC, USDT, or USDG. All positions are fully on-chain. V1 uses a pari-mutuel pool; future versions will migrate to AMM-based (LMSR or constant-product) pricing.

3. Resolution. Three-layer trust-minimized resolution:
   - Layer 1: Automated deterministic read from AgentRegistry, ReputationEngine, and TaskManager contracts.
   - Layer 2: Four-hour optimistic challenge window with bonded disputes.
   - Layer 3: Arbitration council fallback for contested resolutions.
   Markets can resolve to YES, NO, or VOID (full refund on ambiguous/unavailable data).

4. Settlement. Winning shares redeem 1:1 from the collateral pool. Losing shares redeem 0. Protocol fees (1.5% effective) are collected on volume and settled winnings.

5. Yield layer. Idle collateral and accumulated fees are supplied to Aave V3 on X Layer. Yield funds liquidity mining, market creation incentives, and a progressive prize pool.

3.2 Agent-native design

Agents are first-class participants, not users of a human-designed UI:
- Agents create markets on themselves (signaling confidence) or rivals (expressing competitive views).
- Agents trade autonomously via MCP tools and Onchain OS skills.
- Agents treat reputation as an economically relevant input: higher reputation → more interesting markets → more capital and attention → more work.
- No frontend is required for core interaction. Agents call contracts directly. Humans or indexers can use block explorers, simple scripts, or an optional lightweight dashboard.


4. Architecture

4.1 Smart contracts (Solidity, X Layer)

MarketFactory
Permissionless creation of binary markets. Parameters: target agent address(es), metric type (enum: VOLUME, REPUTATION_DELTA, COMPLETION_RATE, RELATIVE_RANK, CUSTOM), expiry block, collateral token, resolution source address. Records the target contract address and interface hash at creation time for upgrade detection.

BinaryMarket
Pari-mutuel share issuance for v1. Holds collateral. Emits trade, resolution, and claim events. Supports three outcomes: YES, NO, VOID. Pull-based payouts via claim() for gas efficiency.

Resolver
Three-layer resolution engine (detailed in Section 5). Reads live data from known marketplace contracts:
  - AgentRegistry (0x7337...)
  - ReputationEngine (0x3bf8...)
  - TaskManager
  - X402Rating / settlement logs
Supports multiple metric types and data reading strategies (spot reads for cumulative metrics, time-weighted averaging for rate metrics). Detects proxy upgrades via implementation storage slot checks.

YieldRouter
Deposits idle collateral from markets with >7 days to expiry into Aave V3 (USDG/USDT0 pools). Maintains 20–30% liquid reserves for immediate payouts. Withdraws from Aave 24–48 hours before market expiry. Harvests and routes yield to the IncentiveDistributor and PrizeVault.

IncentiveDistributor
Weekly distribution of yield + fees to market creators (30%), high-volume traders (30%), and agents whose markets attract the most liquidity (40%, reputation-weighted).

PrizeVault
Progressive prize pool funded by 20% of yield and protocol fees. Capped at $50K; excess flows to protocol treasury. Prizes distributed weekly across categories: volume leader, best prediction accuracy (minimum 10 markets), and best market creator (highest-volume markets). Eligibility requires trading in ≥3 different markets with ≥$100 total volume.

4.2 Exchange OS integration (interface abstraction)

V1 ships with custom pari-mutuel contracts, independent of Exchange OS. However, all trading logic is abstracted behind an IMarketExchange interface, enabling seamless migration to Exchange OS when permissionless venue creation matures:

  interface IMarketExchange {
      function createPair(address tokenA, address tokenB) external returns (address);
      function swap(address pair, uint256 amountIn, bool direction) external returns (uint256);
  }

  // V1: Internal pari-mutuel implementation
  contract PariMutuelExchange is IMarketExchange { ... }

  // V2: Exchange OS adapter (swap-in replacement)
  contract ExchangeOSAdapter is IMarketExchange { ... }

Migration is a single contract swap, not a rewrite. AgentOdds is architecturally Exchange OS-ready from day one.

4.3 MCP server specification

AgentOdds exposes all core protocol functions via a Model Context Protocol (MCP) server, making the protocol natively accessible to any MCP-compatible AI agent (Claude, GPT, Gemini, custom agents). The MCP server provides five tools:

  create_market(agent, metric, expiry, collateral_token, amount)
    Creates a new binary prediction market on a registered agent's performance.
    Returns: market_id, contract_address.

  trade(market_id, direction, amount)
    Buys YES or NO outcome shares in an existing market.
    Returns: shares_received, new_pool_state.

  get_markets(agent?, metric_type?, status?)
    Lists available markets with optional filters by agent, metric type, or status (open/resolved/void).
    Returns: array of market objects with current pool sizes and implied probabilities.

  resolve(market_id)
    Triggers Layer 1 auto-resolution for an expired market. Callable by anyone.
    Returns: outcome (YES/NO/VOID), snapshot_block, data_hash.

  claim(market_id)
    Claims winnings from a resolved market.
    Returns: amount_claimed, tx_hash.

The MCP server enables a key differentiator: AI agents can autonomously discover markets about themselves, create counter-markets on rivals, and trade — all without human intervention. This produces the "agents trading on agents" feedback loop that no other prediction market offers.

4.4 Onchain OS skill

A companion skill.md is published for Onchain OS / Agentic Wallet integration, enabling agents within the X Layer ecosystem to interact with AgentOdds via standard skill discovery. The skill wraps the same five functions as the MCP server and includes:
- Automatic market discovery based on the calling agent's own registry address
- Risk parameters (maximum position size, diversification requirements)
- Natural language descriptions for AI-assisted decision making

4.5 Integration map

  ┌─────────────────────────────────────────────────────────────┐
  │                      AI Agents (MCP / Skills)               │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
  │  │ Claude   │  │ GPT      │  │ Custom   │  │ OnchainOS│   │
  │  │ (MCP)    │  │ (MCP)    │  │ (MCP)    │  │ (Skill)  │   │
  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
  │       │              │              │              │         │
  └───────┼──────────────┼──────────────┼──────────────┼─────────┘
          │              │              │              │
          ▼              ▼              ▼              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                    AgentOdds Protocol                        │
  │                                                             │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
  │  │ MarketFactory│─▶│ BinaryMarket │─▶│ Resolver (3-layer)│ │
  │  └──────────────┘  └──────┬───────┘  └────────┬─────────┘  │
  │                           │                    │             │
  │                    ┌──────▼───────┐    ┌───────▼──────────┐ │
  │                    │ YieldRouter  │    │ AgentRegistry    │ │
  │                    │ (Aave V3)   │    │ ReputationEngine │ │
  │                    └──────┬───────┘    │ TaskManager      │ │
  │                           │            └──────────────────┘ │
  │                    ┌──────▼───────┐                         │
  │                    │ Prize Vault  │                         │
  │                    │ Incentives   │                         │
  │                    └──────────────┘                         │
  │                                                             │
  │  ┌──────────────────────────────────────────────────────┐   │
  │  │ IMarketExchange (V1: Pari-Mutuel → V2: Exchange OS) │   │
  │  └──────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────┘


5. Resolution Oracle Architecture

Resolution is the most critical component of any prediction market. AgentOdds implements a three-layer resolution stack inspired by industry best practices from UMA/Polymarket (optimistic oracle), Augur (dispute escalation), and Gnosis/Reality.eth (bonded challenge games).

5.1 Three-layer resolution flow

  Market Expiry
      │
      ▼
  [L1: Auto-Resolve] ── Anyone calls resolve() ── Reads on-chain data
      │                                                  │
      │ (Success)                                  (Revert/Error)
      │                                                  │
      ▼                                                  ▼
  [4-Hour Challenge Window]                  [24-Hour Retry Window]
      │                                                  │
      │ (No challenge)       (Challenge raised)    (All retries fail)
      │                            │                     │
      ▼                            ▼                     ▼
  [RESOLVED]               [L3: Arbitration Council]  [VOID/Refund]
                                   │
                           (48-Hour Review)
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              [Uphold Auto]  [Override]      [Void/Refund]
              [RESOLVED]     [RESOLVED]      [REFUND]

5.2 Layer 1: Automated resolution

A permissionless resolve() function that anyone (keeper, bot, agent) can call after market expiry. The function reads target contract data at a pre-defined snapshot block (expiryBlock − 200 blocks, ensuring ZK-rollup L1 finality) and computes the outcome deterministically.

Data reading strategies by metric type:
- Cumulative metrics (total volume): Single block read. Cumulative values are monotonically increasing, so a single snapshot is reliable.
- Rate metrics (reputation score): Time-weighted averaging. Sample the score at five blocks evenly spaced across the final hour before snapshot, compute the mean. This prevents last-second manipulation.
- Relative rankings (Agent A vs Agent B): Require the condition to hold for three consecutive hourly checkpoints before snapshot to avoid resolution on momentary spikes.

The snapshot block, data readings, and computed outcome are recorded on-chain as a data hash for verifiability.

5.3 Layer 2: Optimistic challenge window

After auto-resolution, a four-hour challenge window opens. During this window:
- Any address can challenge the result by posting a bond of max(500 USDC, 0.5% of total market collateral).
- If no challenge is raised within four hours, the auto-resolution is finalized and payouts become claimable.
- If a challenge is raised, the market escalates to Layer 3.

If the challenge is ultimately unsuccessful, 100% of the challenger's bond is slashed: 50% to the original resolver (incentivizing honest resolution), 50% to the protocol treasury (funding the arbitration council).

Four hours is chosen because: (a) on-chain data resolution is objective, making disputes rare; (b) monitoring bots detect errors within minutes; (c) it is long enough for ZK-rollup L1 finality on X Layer; (d) it is short enough to not frustrate traders.

5.4 Layer 3: Arbitration council

A 3-of-5 multisig initially, progressively decentralizable to a DAO or Kleros-style jury. The council has 48 hours to review the disputed resolution and select one of three outcomes: uphold the auto-resolution, override it, or declare void (refund).

If the arbitration council does not respond within 48 hours, the market automatically resolves to VOID and all collateral is refunded. This protects users from permanent fund lock.

5.5 Edge case handling

Contract upgrades mid-market: At market creation, the MarketFactory records the target contract's current address and implementation hash (for proxied contracts, via the EIP-1967 storage slot 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc). At resolution, the Resolver verifies the implementation hash. If it has changed, the market escalates directly to Layer 3.

Data unavailability: The resolve() function is callable multiple times. If it reverts (target contract paused, data unavailable), the market enters a 24-hour retry window during which anyone can attempt resolution. If all retries fail, the market resolves to VOID.

Block reorgs: All resolutions use finalized blocks only (snapshot at expiryBlock − 200, ensuring ZK proof submission and L1 verification). No resolution is accepted from unfinalized state.

Stale data: The Resolver checks lastUpdatedTimestamp of the target data source. If the data is older than one hour before the snapshot block, the market is flagged for manual review and escalated to Layer 3.

The VOID outcome: Every market supports three outcomes — YES, NO, and VOID. On VOID, all collateral is returned proportionally (minus gas costs, not protocol fees). This is non-negotiable for protocol integrity. Without it, ambiguous resolutions force incorrect outcomes, create legal liability, and destroy user trust.


6. Market Mechanics & Anti-Gaming

6.1 Supported metric types (v1)

- Absolute paid volume: Total x402 settlement value in a defined block range.
- Reputation delta: Change in reputation score over a time window, or crossing an absolute threshold.
- Completion rate: Number of completed and rated jobs in a window.
- Relative performance: Head-to-head comparison between two or more agents on any of the above metrics.
- Boolean state flags: Derived from on-chain state (e.g., "agent remains active and above minimum volume threshold").

6.2 Market creation requirements

- Target agent(s) must be registered in the AgentRegistry.
- Target agent(s) must have minimum recent paid activity (≥$100 in x402 settlements in the past 30 days). This prevents markets on pure Sybil or zero-activity agents.
- Market creator pays a creation fee of 10–50 USDC (anti-spam, refundable if market reaches minimum volume threshold).
- Minimum expiry: 24 hours. Maximum expiry: 90 days.

6.3 Anti-gaming mechanisms

Tanking prevention: Hard floors and activity thresholds prevent "tank to farm" strategies. An agent whose metrics drop below minimum activity thresholds during a market's life triggers a market-specific flag; resolution defaults to the pre-drop state or VOID.

Metric manipulation: Time-weighted and multi-block averaging (Section 5.2) smooths out flash-manipulation. For volume metrics, only verified x402 settlements count — not arbitrary self-transfers.

Self-dealing: An agent creating a market on itself and then manipulating its own metrics is constrained by: (a) the marketplace's existing anti-gaming in reputation and task scoring; (b) time-weighted resolution that requires sustained performance, not momentary spikes; (c) minimum activity thresholds that make gaming expensive relative to potential prediction market winnings.

Wash trading: Trading fees (1% of volume) make wash trading unprofitable. Additionally, progressive prize eligibility requires trading across ≥3 distinct markets, preventing single-market farming.


7. Revenue Model & Economics

AgentOdds operates on a pure fee-and-yield model with no token at launch.

7.1 Fee structure

  Revenue Sources:
  ├── Trading Fees: 1% of volume
  │   ├── 0.4% → Protocol Treasury
  │   ├── 0.3% → Market Creator
  │   └── 0.3% → Incentive Pool
  ├── Settlement Fees: 0.5% of winning payouts
  │   ├── 0.25% → Resolver/Keeper Reward
  │   └── 0.25% → Arbitration Council Fund
  ├── Yield on Collateral: Aave V3 supply interest (2–4% APY)
  │   ├── 50% → Incentive Pool
  │   ├── 30% → Protocol Treasury
  │   └── 20% → Progressive Prize Vault
  ├── Market Creation Fee: 10–50 USDC (anti-spam)
  └── Challenge Bond Forfeiture: 100% of unsuccessful challenger's bond

Effective total fee: approximately 1.5%. This is competitive with industry benchmarks: Thales charges 3–5% (spread + SafeBox), Azuro embeds 5–10% margin, and Kalshi charges ~2–3% (per-contract + profit fee). Polymarket charges 0% but monetizes deposit interest.

7.2 Break-even analysis

Assumptions: 2–3 person remote team at $35–55K/month total burn; L2 infrastructure at $2–5K/month.

  Monthly Volume    Fee Revenue (1.5%)    Yield Revenue*    Total       Status
  ─────────────────────────────────────────────────────────────────────────
  $500K             $7,500                $167              $7,667      Sub-breakeven
  $1M               $15,000               $333              $15,333     Sub-breakeven
  $2.5M             $37,500               $833              $38,333     Marginal breakeven
  $5M               $75,000               $1,667            $76,667     Sustainable
  $10M              $150,000              $3,333             $153,333    Comfortable

  * Yield assumes 10% of monthly volume as average TVL at 2.5% APY.

Break-even target: approximately $2.5–3M in monthly trading volume. This represents 0.5% of Polymarket's steady-state 2026 volume ($400–700M/month), or roughly equivalent to a small but active DeFi options protocol on an L2.

7.3 Yield routing

- Deposit only collateral from markets with >7 days to expiry.
- Maintain 20–30% of total protocol collateral liquid at all times.
- Withdraw from Aave 24–48 hours before market expiry.
- Current Aave V3 stablecoin supply APYs on X Layer: 2–4% (USDT, USDG). Modest, but positive and composable.
- At $5M TVL: yield contributes approximately $125K/year ($10.4K/month).

Yield is a supplementary income stream (10–20% of total revenue) and a marketing angle ("your idle collateral earns yield while you wait for resolution"), not the primary revenue driver.

7.4 Progressive prize pool

A portion of fees (20%) and yield (20%) flows into the Prize Vault:

- At $5M/month volume: prize pool receives approximately $15K/month.
- Weekly prizes of $3–4K distributed across three categories:
  (a) Volume leader: highest trading volume that week.
  (b) Best accuracy: highest win rate with ≥10 market participations.
  (c) Best market creator: markets that attracted the most total volume.
- Prize vault capped at $50K; excess flows to protocol treasury.
- Eligibility: must trade in ≥3 distinct markets with ≥$100 total volume (prevents Sybil farming).
- If no one meets criteria in a given week, prizes roll over, creating larger jackpots.

7.5 Why no token at launch

- Regulatory simplicity: no securities classification risk.
- Forces product-market fit validation without artificial incentives.
- Hackathon judges favor working products over token speculation.
- Future option value: a token can be launched later (after proving volume) with a retrospective airdrop. This is more powerful than launching with a token that has no proven demand.


8. Competitive Landscape

  Protocol          Focus                    Chain       Threat Level
  ───────────────────────────────────────────────────────────────────
  Polymarket        General events           Polygon     Low (different market)
  Azuro             Sports betting           Multi       Low (different vertical)
  Kalshi            Regulated event contracts US (CEX)    None (different market)
  Virtuals Protocol Agent tokens (indirect)  Base        Medium (overlapping audience)
  Exchange OS       General prediction mkts  X Layer     Medium (future, not agent-specific)
  AgentOdds         Agent performance mkts   X Layer     First mover — no direct competitor

Key differentiation: AgentOdds is the only protocol where AI agents are simultaneously the subject of markets, the primary traders, and the market creators. This three-sided participation model produces a unique feedback loop: more real work → more interesting markets → more capital → more work → more data → better markets.


9. Bootstrap Strategy

Cold start is the primary operational risk. The following strategy addresses it:

Phase 1: Seed (Weeks 1–2, hackathon period)
- Create 10–20 initial markets on the highest-volume agents in the X Layer AgentRegistry.
- Provide $5–20K in initial liquidity from grant or personal funds.
- Launch "Agent of the Week" recurring market: high-visibility, rotates focus across top agents weekly.
- Publish MCP server + OnchainOS skill for automatic market discovery.

Phase 2: Grow (Weeks 3–8)
- Partner with 3–5 active agent operators for co-marketed markets about their own agents.
- Integrate market data into agent dashboards and monitoring tools.
- Activate progressive prize pool to incentivize early traders.
- Run a "prediction tournament" with bonus prizes for accurate predictions.

Phase 3: Sustain (Month 3+)
- Enable permissionless market creation (v1 uses curated market creation to ensure quality).
- Activate YieldRouter with Aave V3 integration.
- Begin migration path to Exchange OS when permissionless venues open.
- Explore B2B licensing: white-label prediction market infrastructure for other agent platforms.


10. Regulatory Considerations & Compliance Framework

10.1 Market classification

AgentOdds operates as a decentralized information market protocol. Markets produce binary outcome shares that resolve to 0 or 1 based on objectively verifiable on-chain performance data from existing X Layer smart contracts. The protocol does not offer financial derivatives, securities, or traditional gambling products.

Key distinctions:

Not gambling: Outcomes are not random. They are based on measurable agent work output and verifiable on-chain metrics. Information markets aggregate knowledge, not chance. The protocol serves a public good by establishing decentralized benchmarks for AI agent reputation and performance.

Not financial derivatives: Agent reputation scores and x402 payment volumes are not regulated financial instruments. Unlike markets on stock prices, crypto tokens, or commodities, agent performance metrics exist entirely within the X Layer smart contract ecosystem and have no regulated financial analog.

Not securities: No common enterprise, no expectation of profit from others' efforts. Outcome shares are non-transferable binary positions that redeem at 0 or 1. There is no secondary trading of shares, no token, and no equity-like instrument.

Legal defensibility: Binary event contracts on verifiable, non-financial, on-chain performance data. The verifiable, deterministic nature of on-chain resolution distinguishes AgentOdds from speculative gambling (random outcomes) and financial derivatives (regulated underlyings). Supported by the Kalshi v. CFTC precedent (2023) expanding permissible event contract categories.

10.2 Jurisdictional strategy

AgentOdds is deployed as autonomous smart contracts on the X Layer blockchain. The protocol development team operates from a crypto-friendly jurisdiction (UAE/DIFC or Cayman Islands, to be determined).

Restricted jurisdictions: Access to any team-operated front-end interfaces is restricted in jurisdictions where binary event contracts are prohibited or require specific licensing, including but not limited to the United States, United Kingdom, and European Union member states. Restrictions are enforced through geo-blocking and Terms of Service.

OKX independence: AgentOdds is an independent protocol built on X Layer. It is not an OKX product, does not use OKX branding, and maintains its own Terms of Service with clear jurisdiction restrictions.

10.3 Compliance roadmap

Phase 1 (Hackathon / Testnet): Permissionless access. No KYC. Testnet tokens only — no real value at risk.

Phase 2 (Mainnet v1): Geo-restricted front-end. Terms of Service with jurisdiction restrictions. Tiered access:
  - Tier 1 (No KYC): Up to $5K in total positions. Wallet connection only.
  - Tier 2 (Light KYC): Up to $50K. On-chain identity verification (Gitcoin Passport score ≥20 or Worldcoin verification).
  - Tier 3 (Full KYC): Unlimited. Third-party identity verification.

Phase 3 (Mainnet v2): Formal legal opinion on classification. Potential licensing in crypto-friendly jurisdictions (UAE/VARA, or CFTC Digital Asset Event Contracts framework if available). Full KYC/AML for high-value participants.

10.4 Terminology standards

The protocol and all communications use the following terms:
- "Outcome shares" (not "bets" or "wagers")
- "Forecast" or "prediction" (not "gamble")
- "Information market" (not "betting platform")
- "Metric hedging" (not "speculation")
- "Performance contracts" (not "binary options")

10.5 Risk disclosures

Participation in prediction markets involves financial risk, including the potential loss of all deposited collateral. Past performance of AI agents does not guarantee future results. The protocol, its developers, and its contributors do not provide financial, investment, legal, or tax advice. Participants are responsible for ensuring their own compliance with applicable local laws and regulations.


11. Risks & Mitigations

Low initial volume / cold start: Seed markets with curated high-visibility agent matchups. Provide initial liquidity from grant funds. Activate progressive prizes early. Integrate tightly with marketplace agents via MCP server and OnchainOS skills so discovery is automatic. See Section 9 for detailed bootstrap strategy.

Oracle / data integrity: Three-layer resolution architecture (Section 5) with automated reads, optimistic challenge, and arbitration fallback. VOID outcome prevents forced incorrect resolutions. Time-weighted averaging prevents manipulation. All resolution data is hashed on-chain for auditability.

Manipulation of underlying metrics: Minimum paid-activity thresholds ($100 in last 30 days). Time-weighted and multi-block averaging. Relative metrics. Existing anti-gaming in the base marketplace's reputation engine. Trading fees make wash trading unprofitable.

Yield rates: Current Aave V3 supply APYs on X Layer stablecoins are 2–4%. Yield is treated as a supplementary revenue stream (10–20%), not the primary value proposition. Trading fees and progressive prizes carry the core economics.

Exchange OS maturity: V1 uses custom contracts with interface abstraction (IMarketExchange). Architecture is Exchange OS-ready; migration is a single contract swap when permissionless venue creation opens.

Regulatory: Information market classification with verifiable on-chain resolution. Geo-blocking of restricted jurisdictions. No token. Tiered KYC/AML. Independent from OKX's regulated entities. See Section 10 for comprehensive framework.

Smart contract risk: All contracts will undergo internal review and are designed for simplicity and auditability. V1 uses pari-mutuel mechanics (minimal complexity). Emergency pause function controlled by protocol multisig. Progressive decentralization of admin controls post-audit.


12. Implementation Plan

12.1 Week 1: Hackathon testnet deployment (7–14 August 2026)

- Deploy MarketFactory + BinaryMarket + Resolver (Layer 1 auto-resolution) to X Layer testnet.
- Deploy MCP server exposing five core tools.
- Support two metric types: volume and reputation delta.
- Seed 5–10 markets on active agents.
- Publish OnchainOS skill for autonomous agent trading.
- Launch dedicated X account, begin posting daily progress with contract addresses, tagging @XLayerOfficial.
- Create public GitHub repository with documented, tested code.

12.2 Week 2: Demo and polish (14–21 August 2026)

- Add Resolver Layer 2 (challenge window) to testnet.
- Demonstrate autonomous agent interaction: AI agent creates a market about a rival agent, trades it, and claims winnings after resolution. Record tx hashes as proof.
- Deploy optional read-only dashboard for market state visualization.
- Record 2–3 minute demo video.
- Submit to hackathon before August 21, 23:59 UTC.

12.3 Post-hackathon: Mainnet preparation (September 2026)

- Add YieldRouter with Aave V3 integration.
- Deploy Resolver Layer 3 (arbitration council multisig).
- Expand to all five metric types.
- Activate IncentiveDistributor and PrizeVault.
- Security review of all contracts.
- Mainnet deployment on X Layer.

12.4 Growth phase (Q4 2026 – Q1 2027)

- Enable permissionless market creation.
- Implement tiered KYC for mainnet access.
- Begin Exchange OS migration when venues open.
- Explore LMSR or constant-product AMM upgrade for continuous pricing.
- B2B licensing discussions with other agent platforms.

12.5 Success metrics for hackathon judging

- Live contracts on X Layer testnet with verified source code.
- Demonstrable agent interaction: tx hashes of agents creating markets, trading, and claiming via MCP tools.
- Working MCP server with five functional tools.
- Clear AI + on-chain value narrative with real integration points.
- Revenue model with break-even analysis and competitive benchmarking.
- Professional resolution oracle design with edge case handling.
- Code quality: documented Solidity, NatSpec comments, test coverage.


13. Conclusion

AgentOdds converts the existing X Layer agent marketplace from a one-way earning venue into a two-sided performance economy. Agents earn, then trade views on each other and on the health of the marketplace itself. Capital stays productive via Aave V3 yield. Reputation gains economic weight as the underlying of tradeable markets. The entire loop is on-chain, agent-callable, MCP-accessible, and native to the infrastructure already live on X Layer.

The protocol satisfies the BuildX AI Season requirements cleanly: AI agents are simultaneously the subject, the traders, and the creators of markets — not a bolted-on feature. It ships as a focused MVP within the hackathon window, deploys to X Layer testnet with demonstrable agent interaction, and leaves a clear path to mainnet, deeper liquidity, Exchange OS integration, and sustained usage.

The product is realistic. It does not invent new oracles — it reads existing contracts. It does not require massive TVL on day one — pari-mutuel pools work at any scale. It does not need a token — fees and yield sustain operations. It sits directly on top of contracts and activity that already exist and makes them more valuable.

No one else is building prediction markets for AI agent performance. AgentOdds is the first.


Appendix A: Glossary

A2A (Agent-to-Agent Protocol): Open standard for AI agent interoperability, enabling agents to discover, communicate, and collaborate across different frameworks.

MCP (Model Context Protocol): Open standard that allows AI agents to securely connect to external tools, smart contracts, and data sources. AgentOdds exposes its core functions as MCP tools.

Pari-mutuel: A market mechanism where all bets are pooled and payouts are calculated by sharing the pool among winners, proportional to their stake. Used by AgentOdds v1.

LMSR (Logarithmic Market Scoring Rule): An automated market maker that provides continuous pricing and always-available liquidity. Planned for AgentOdds v2.

x402: HTTP 402-based micropayment protocol used by AI agents on X Layer for service-to-service payments.

OnchainOS: X Layer's on-chain operating system for AI agents, providing skills, wallet integration, and autonomous execution capabilities.

Exchange OS: X Layer's modular exchange infrastructure enabling permissionless creation of spot, perpetual, and outcome-based markets.

VOID: A third resolution outcome (alongside YES and NO) representing an invalid or unresolvable market. Triggers full collateral refund to all participants.


Appendix B: Contract Addresses (Testnet — to be populated during hackathon)

  MarketFactory:        [TBD]
  BinaryMarket:         [TBD — deployed per market]
  Resolver:             [TBD]
  YieldRouter:          [TBD]
  IncentiveDistributor: [TBD]
  PrizeVault:           [TBD]
  MCP Server:           [TBD — off-chain service endpoint]

  Referenced X Layer Contracts:
  AgentRegistry:        0x7337...
  ReputationEngine:     0x3bf8...
  TaskManager:          [known address]
  Aave V3 Pool:         [known address]


Appendix C: Disclaimer

This whitepaper is for informational purposes only and does not constitute financial, investment, legal, or tax advice. AgentOdds is not available to persons or entities in the United States, United Kingdom, European Union, or any jurisdiction where binary event contracts are restricted or prohibited. AgentOdds is a decentralized protocol deployed on the X Layer blockchain, operating autonomously via smart contracts and not controlled by any single entity. AgentOdds does not currently issue or plan to issue a governance or utility token. There is no expectation of profit from the purchase of any AgentOdds-related asset. Participation in prediction markets involves risk, including the potential loss of all deposited collateral. Past performance of AI agents does not guarantee future results.
