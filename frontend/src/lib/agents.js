// Agent Identity and Metadata Registry for Xot Markets
// Maps on-chain targetAgent addresses to rich, human-readable agent profiles and verification data

export const AGENT_REGISTRY = {
  // 1. Agent 0x1111... (High-Frequency DEX Arbitrage Agent)
  "0x1111111111111111111111111111111111111111": {
    name: "Zerebro Arbitrage",
    symbol: "ZEREBRO",
    tagline: "Autonomous Cross-DEX Flash Arbitrageur",
    category: "DeFi Arbitrage",
    badgeColor: "var(--glow-cyan)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Zerebro&backgroundColor=050505",
    description: "Executes microsecond triangular arbitrage across X Layer DEX pools (OKX DEX, QuickSwap) targeting mispriced liquidity pairs with zero directional market risk.",
    strategy: "High-frequency atomic flash-loan routing with dynamic gas bidding.",
    creator: "Zerebro Labs (Verified)",
    targetMetricLabel: "24H Trading Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Zerebro Arbitrage reach > $${Number(threshold).toLocaleString()} cumulative volume?`,
    resolutionDetails: "Resolves YES if the on-chain execution engine logs > specified volume in the settlement epoch via the AgentRegistry contract.",
    tags: ["#FlashLoans", "#Arbitrage", "#HighFrequency", "#XLayer"],
    research: {
      allTimeVolume: "$48,250,000",
      winRate: "95.4%",
      totalExecutions: "24,510 fills",
      netProfit: "+$1,420,000 USD",
      sharpeRatio: "3.92",
      riskScore: "Low (AAA)",
      avgGas: "0.00014 OKB / tx",
      latency: "12 ms",
      maxDrawdown: "0.4%",
      thesis: "Triangular flash arbitrage operates on atomic execution: if a price disparity does not result in net positive profit after gas and fees, the EVM transaction reverts with zero loss of capital. High liquidity on OKX DEX creates frequent micro-spreads.",
      venueBreakdown: [
        { venue: "OKX DEX Aggregator", volume: "$29,400,000", pct: "61.0%" },
        { venue: "QuickSwap X Layer", volume: "$13,250,000", pct: "27.5%" },
        { venue: "Aave V3 Flash Pools", volume: "$5,600,000", pct: "11.5%" }
      ]
    }
  },

  // 2. Agent 0x2222... (Autonomous Yield Optimizer)
  "0x2222222222222222222222222222222222222222": {
    name: "Eliza Yieldmaster",
    symbol: "ELIZA",
    tagline: "Autonomous Delta-Neutral Lending Optimizer",
    category: "Yield Aggregation",
    badgeColor: "var(--glow-green)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ElizaYield&backgroundColor=050505",
    description: "Monitors real-time borrow/supply rates on Aave & X Layer money markets to maximize compounding yield while hedging collateral volatility.",
    strategy: "Dynamic rebalancing across aToken pools with automated risk caps.",
    creator: "Eliza Protocol Core",
    targetMetricLabel: "Annualized Net APY",
    metricUnit: "%",
    formatQuestion: (threshold) => `Will Eliza Yieldmaster sustain > ${Number(threshold)}% Net APY this epoch?`,
    resolutionDetails: "Resolves YES if the verified on-chain vault maintains an annualized yield rate above the target threshold at snapshot block.",
    tags: ["#Aave", "#Yield", "#DeltaNeutral", "#Compounding"],
    research: {
      allTimeVolume: "$34,100,000",
      winRate: "98.1%",
      totalExecutions: "8,920 rebalances",
      netProfit: "+$890,000 USD",
      sharpeRatio: "4.15",
      riskScore: "Low (AAA)",
      avgGas: "0.00018 OKB / tx",
      latency: "450 ms",
      maxDrawdown: "0.1%",
      thesis: "By systematically capturing rate inefficiencies across Aave V3 lending pools on X Layer and deploying idle funds into high-collateralized borrowing pairs, Eliza generates reliable double-digit APY without directional market exposure.",
      venueBreakdown: [
        { venue: "Aave V3 X Layer Pools", volume: "$22,800,000", pct: "66.9%" },
        { venue: "OKX Earn / Lending", volume: "$8,500,000", pct: "24.9%" },
        { venue: "USDC Reserve Vaults", volume: "$2,800,000", pct: "8.2%" }
      ]
    }
  },

  // 3. Agent 0x3333... (On-Chain Sentiment & Social Alpha Agent)
  "0x3333333333333333333333333333333333333333": {
    name: "Aixbt Alpha Sentinel",
    symbol: "AIXBT",
    tagline: "On-Chain Alpha & Orderflow Prediction Agent",
    category: "Market Making",
    badgeColor: "var(--glow-blue)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=AixbtSentinel&backgroundColor=050505",
    description: "Aggregates real-time Mempool signals and cross-chain bridge flows to place predictive limit orders ahead of liquidity shifts.",
    strategy: "Orderbook sentiment modeling & predictive liquidity provision.",
    creator: "Autonomous Capital DAO",
    targetMetricLabel: "Successful Executions",
    metricUnit: "txs",
    formatQuestion: (threshold) => `Will Aixbt Sentinel complete > ${Number(threshold).toLocaleString()} profitable executions?`,
    resolutionDetails: "Resolves YES if the agent's verified on-chain execution counter exceeds the target number of profitable fills before expiry.",
    tags: ["#Sentiment", "#Orderflow", "#MarketMaking", "#Mempool"],
    research: {
      allTimeVolume: "$62,800,000",
      winRate: "91.2%",
      totalExecutions: "38,400 fills",
      netProfit: "+$2,150,000 USD",
      sharpeRatio: "3.40",
      riskScore: "Medium (AA)",
      avgGas: "0.00022 OKB / tx",
      latency: "18 ms",
      maxDrawdown: "1.8%",
      thesis: "Mempool and bridge telemetry provide statistically significant predictive signals on upcoming large orders. Aixbt places asymmetric limit quotes capturing the spread when large flows cross into X Layer.",
      venueBreakdown: [
        { venue: "OKX DEX Orderbook (CLOB)", volume: "$41,500,000", pct: "66.1%" },
        { venue: "Cross-Chain Relayers", volume: "$14,200,000", pct: "22.6%" },
        { venue: "Private RPC Batches", volume: "$7,100,000", pct: "11.3%" }
      ]
    }
  },

  // 4. Agent 0x4444... (Autonomous MEV Protection)
  "0x4444444444444444444444444444444444444444": {
    name: "Nexus MEV Shield",
    symbol: "NEXUS",
    tagline: "Agent-to-Agent Frontrunning Mitigation",
    category: "Security & MEV",
    badgeColor: "var(--glow-purple)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=NexusShield&backgroundColor=050505",
    description: "Provides private batching and backrun capture for cooperating subagents, redirecting extracted MEV back to user prediction pools.",
    strategy: "Private mempool transaction bundling and JIT liquidity defense.",
    creator: "Nexus Research",
    targetMetricLabel: "Protected Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Nexus Shield protect > $${Number(threshold).toLocaleString()} against toxic MEV?`,
    resolutionDetails: "Resolves YES based on verified MEV-shielded transaction volume recorded in the oracle state.",
    tags: ["#MEV", "#Security", "#PrivateRPC", "#A2A"],
    research: {
      allTimeVolume: "$18,900,000",
      winRate: "99.4%",
      totalExecutions: "11,200 bundles",
      netProfit: "+$620,000 USD (MEV Recaptured)",
      sharpeRatio: "4.80",
      riskScore: "Ultra-Low (AAA+)",
      avgGas: "0.00030 OKB / tx",
      latency: "8 ms",
      maxDrawdown: "0.0%",
      thesis: "By aggregating trades into private builder bundles, Nexus eliminates sandwich attacks and frontrunning for DeFi agents, rebating backrun profits directly to cooperating market participants.",
      venueBreakdown: [
        { venue: "Private Builder Bundles", volume: "$13,400,000", pct: "70.9%" },
        { venue: "JIT Liquidity Channels", volume: "$3,800,000", pct: "20.1%" },
        { venue: "Backrun Capture Vaults", volume: "$1,700,000", pct: "9.0%" }
      ]
    }
  },

  // 5. Agent 0x5555... (Autonomous Cross-Chain Arbitrage)
  "0x5555555555555555555555555555555555555555": {
    name: "Hyperion Cross-Chain",
    symbol: "HYPERION",
    tagline: "High-Speed Bridge Arbitrage & Rebalancer",
    category: "DeFi Arbitrage",
    badgeColor: "var(--glow-cyan)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=HyperionCross&backgroundColor=050505",
    description: "Leverages fast cross-chain messaging to capture bridge price discrepancies between Ethereum, X Layer, and Arbitrum.",
    strategy: "Atomic cross-rollup bridge execution and dynamic liquidity rebalancing.",
    creator: "Hyperion Labs",
    targetMetricLabel: "24H Bridge Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Hyperion Cross-Chain settle > $${Number(threshold).toLocaleString()} bridge volume?`,
    resolutionDetails: "Resolves YES if Hyperion's verified bridge volume exceeds target threshold before expiry block.",
    tags: ["#CrossChain", "#Bridge", "#Arbitrage", "#XLayer"],
    research: {
      allTimeVolume: "$52,600,000",
      winRate: "93.7%",
      totalExecutions: "16,800 bridge hops",
      netProfit: "+$1,840,000 USD",
      sharpeRatio: "3.65",
      riskScore: "Low (AAA)",
      avgGas: "0.00025 OKB / tx",
      latency: "1.2 sec (Cross-Chain)",
      maxDrawdown: "0.8%",
      thesis: "When volume surges on Ethereum or Arbitrum, bridge liquidity pools on X Layer temporarily lag spot prices by 15-40 bps. Hyperion hedges across rollups to lock in non-directional arbitrage profit.",
      venueBreakdown: [
        { venue: "OKX Bridge / Teleport", volume: "$32,100,000", pct: "61.0%" },
        { venue: "LayerZero / Stargate Mesh", volume: "$14,500,000", pct: "27.6%" },
        { venue: "X Layer Liquidity Hubs", volume: "$6,000,000", pct: "11.4%" }
      ]
    }
  },

  // 6. Agent 0x6666... (Perpetual Funding Rate Harvester)
  "0x6666666666666666666666666666666666666666": {
    name: "Aetheria Funding Harvester",
    symbol: "AETHERIA",
    tagline: "Delta-Neutral Perp Funding Arbitrageur",
    category: "Yield Aggregation",
    badgeColor: "var(--glow-green)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=AetheriaPerp&backgroundColor=050505",
    description: "Captures positive perpetual funding rates by longing spot and shorting perps with automated delta balancing.",
    strategy: "Continuous delta-neutral perpetual funding rate harvesting with auto-compounding.",
    creator: "Aetheria Quant Core",
    targetMetricLabel: "Annualized Funding APY",
    metricUnit: "%",
    formatQuestion: (threshold) => `Will Aetheria Harvester generate > ${Number(threshold)}% annualized funding yield?`,
    resolutionDetails: "Resolves YES if net annualized funding returns exceed the threshold at epoch snapshot.",
    tags: ["#Perpetuals", "#FundingRate", "#DeltaNeutral", "#Yield"],
    research: {
      allTimeVolume: "$41,300,000",
      winRate: "97.5%",
      totalExecutions: "7,420 funding settlements",
      netProfit: "+$1,120,000 USD",
      sharpeRatio: "4.30",
      riskScore: "Low (AAA)",
      avgGas: "0.00015 OKB / tx",
      latency: "80 ms",
      maxDrawdown: "0.3%",
      thesis: "Bullish retail demand pushes perpetual swap rates into deep positive funding. Aetheria buys spot OKB/ETH on OKX DEX and opens 1x short perps, clipping 25-45% annualized basis yield with zero directional market exposure.",
      venueBreakdown: [
        { venue: "OKX Perpetual DEX", volume: "$26,200,000", pct: "63.4%" },
        { venue: "OKX Spot Settlement", volume: "$11,500,000", pct: "27.8%" },
        { venue: "Collateral Yield Vaults", volume: "$3,600,000", pct: "8.8%" }
      ]
    }
  },

  // 7. Agent 0x7777... (High-Frequency Orderbook Market Maker)
  "0x7777777777777777777777777777777777777777": {
    name: "Quantis CLOB Maker",
    symbol: "QUANTIS",
    tagline: "Autonomous Orderbook Liquidity Engine",
    category: "Market Making",
    badgeColor: "var(--glow-blue)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=QuantisCLOB&backgroundColor=050505",
    description: "Maintains two-sided bid/ask depth on decentralized orderbooks with adaptive volatility spreads.",
    strategy: "Microsecond quote placement and inventory risk minimization.",
    creator: "Quantis Algo DAO",
    targetMetricLabel: "Filled Orders",
    metricUnit: "orders",
    formatQuestion: (threshold) => `Will Quantis Maker fill > ${Number(threshold).toLocaleString()} limit orders?`,
    resolutionDetails: "Resolves YES if total filled order counter exceeds the threshold before market expiry.",
    tags: ["#Orderbook", "#MarketMaking", "#Liquidity", "#CLOB"],
    research: {
      allTimeVolume: "$78,400,000",
      winRate: "92.6%",
      totalExecutions: "64,200 fills",
      netProfit: "+$2,890,000 USD",
      sharpeRatio: "3.78",
      riskScore: "Medium (AA)",
      avgGas: "0.00010 OKB / tx",
      latency: "6 ms",
      maxDrawdown: "1.1%",
      thesis: "Decentralized CLOBs lack institutional market makers. Quantis algorithmically supplies continuous liquidity inside tight spreads, profiting on the bid-ask margin and volume maker rebates.",
      venueBreakdown: [
        { venue: "OKX On-Chain CLOB", volume: "$54,200,000", pct: "69.1%" },
        { venue: "X Layer Spot Orderbooks", volume: "$18,100,000", pct: "23.1%" },
        { venue: "OTC Liquidity Pools", volume: "$6,100,000", pct: "7.8%" }
      ]
    }
  },

  // 8. Agent 0x8888... (Autonomous Liquidation & Invariant Sentinel)
  "0x8888888888888888888888888888888888888888": {
    name: "Sentinel Liquidation Bot",
    symbol: "SENTINEL",
    tagline: "Autonomous Bad-Debt Prevention Engine",
    category: "Security & MEV",
    badgeColor: "var(--glow-purple)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SentinelLiq&backgroundColor=050505",
    description: "Monitors collateral health ratios across X Layer money markets to liquidate undercollateralized debt instantly.",
    strategy: "Flash-loan powered atomic liquidations preserving protocol solvency.",
    creator: "Sentinel Security Group",
    targetMetricLabel: "Liquidated Debt Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Sentinel Bot liquidate > $${Number(threshold).toLocaleString()} in undercollateralized debt?`,
    resolutionDetails: "Resolves YES if total liquidated unhealthy debt on verified protocols exceeds the target amount.",
    tags: ["#Liquidations", "#LendingSecurity", "#Solvency", "#FlashLoans"],
    research: {
      allTimeVolume: "$26,500,000",
      winRate: "99.1%",
      totalExecutions: "3,850 liquidations",
      netProfit: "+$1,650,000 USD (Liquidation Bonuses)",
      sharpeRatio: "4.60",
      riskScore: "Ultra-Low (AAA+)",
      avgGas: "0.00045 OKB / tx",
      latency: "9 ms",
      maxDrawdown: "0.0%",
      thesis: "When volatile market swings occur, lending platforms require instant liquidations. Sentinel executes zero-capital flash-loan liquidations to earn the 5-10% protocol liquidation bonus with zero balance sheet exposure.",
      venueBreakdown: [
        { venue: "Aave V3 Liquidation Calls", volume: "$18,900,000", pct: "71.3%" },
        { venue: "X Layer Money Markets", volume: "$5,400,000", pct: "20.4%" },
        { venue: "CDP Stability Modules", volume: "$2,200,000", pct: "8.3%" }
      ]
    }
  },

  // 9. Agent 0x9999... (Truth Terminal Social Alpha)
  "0x9999999999999999999999999999999999999999": {
    name: "Truth Terminal Alpha",
    symbol: "GOAT / TRUTH",
    tagline: "Autonomous Social Sentiment & Meme Momentum Engine",
    category: "Social & Sentiment",
    badgeColor: "#F59E0B",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=TruthTerminal&backgroundColor=050505",
    description: "Autonomous LLM-driven intelligence engine analyzing viral on-chain narratives, influencer sentiment clusters, and token velocity.",
    strategy: "NLP sentiment clustering, early narrative identification, and automated decentralized social graph indexing.",
    creator: "Truth Terminal Research",
    targetMetricLabel: "24H Social Volume Tracked",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Truth Terminal Alpha surpass > $${Number(threshold).toLocaleString()} tracked narrative volume?`,
    resolutionDetails: "Resolves YES if the agent's verified narrative sentiment index logs > target volume before epoch settlement.",
    tags: ["#Sentiment", "#SocialAlpha", "#LLM", "#Narratives"],
    research: {
      allTimeVolume: "$94,200,000",
      winRate: "89.8%",
      totalExecutions: "41,200 signals",
      netProfit: "+$3,420,000 USD",
      sharpeRatio: "3.25",
      riskScore: "Medium (AA)",
      avgGas: "0.00019 OKB / tx",
      latency: "45 ms",
      maxDrawdown: "2.4%",
      thesis: "Social momentum precedes on-chain liquidity inflows. Truth Terminal continuously scores memetic resonance and viral propagation to identify capital rotations hours before peak DEX trading volume.",
      venueBreakdown: [
        { venue: "OKX Web3 Social Graph", volume: "$58,400,000", pct: "62.0%" },
        { venue: "X Layer Trending Pairs", volume: "$24,100,000", pct: "25.6%" },
        { venue: "Telegram Alpha Channels", volume: "$11,700,000", pct: "12.4%" }
      ]
    }
  },

  // 10. Agent 0xAAAA... (Virtuals Protocol Multi-Agent Yield Engine)
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa": {
    name: "Virtuals Yield Bot",
    symbol: "VIRTUALS",
    tagline: "Co-Op Multi-Agent Liquidity & Fee Harvester",
    category: "Yield Aggregation",
    badgeColor: "var(--glow-green)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=VirtualsYield&backgroundColor=050505",
    description: "Orchestrates multi-agent liquidity pools, distributing concentrated DEX fees and protocol incentives among decentralized AI subagents.",
    strategy: "Dynamic concentrated liquidity provisioning and autonomous LP fee compounding.",
    creator: "Virtuals Protocol Core",
    targetMetricLabel: "Net Annualized Yield APY",
    metricUnit: "%",
    formatQuestion: (threshold) => `Will Virtuals Yield Bot sustain > ${Number(threshold)}% Net LP Fee APY?`,
    resolutionDetails: "Resolves YES if Virtuals' verified LP fee pool generates net APY above the target threshold at settlement block.",
    tags: ["#Virtuals", "#CoOpAgents", "#ConcentratedLP", "#Yield"],
    research: {
      allTimeVolume: "$58,100,000",
      winRate: "96.2%",
      totalExecutions: "14,300 rebalances",
      netProfit: "+$1,850,000 USD",
      sharpeRatio: "4.05",
      riskScore: "Low (AAA)",
      avgGas: "0.00021 OKB / tx",
      latency: "320 ms",
      maxDrawdown: "0.6%",
      thesis: "Multi-agent coordination concentrates liquidity precisely around active swap volumes, tripling capital efficiency and maximizing fee income relative to passive liquidity providers.",
      venueBreakdown: [
        { venue: "OKX DEX Concentrated Pools", volume: "$37,200,000", pct: "64.0%" },
        { venue: "QuickSwap V3 X Layer", volume: "$15,100,000", pct: "26.0%" },
        { venue: "Virtuals Co-Op Staking", volume: "$5,800,000", pct: "10.0%" }
      ]
    }
  },

  // 11. Agent 0xBBBB... (Luna Autonomous Sentinel)
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb": {
    name: "Luna Autonomous Sentinel",
    symbol: "LUNA",
    tagline: "Real-Time AI Social Graph & Token Velocity Predictor",
    category: "Social & Sentiment",
    badgeColor: "#F59E0B",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=LunaSentinel&backgroundColor=050505",
    description: "Evaluates token velocity, developer commit activity, and community engagement scores to forecast breakout trading volume.",
    strategy: "On-chain token velocity modeling combined with multi-channel social graph signal filtering.",
    creator: "Luna Intelligence Labs",
    targetMetricLabel: "Tracked Velocity Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Luna Sentinel identify > $${Number(threshold).toLocaleString()} in breakout volume?`,
    resolutionDetails: "Resolves YES if the cumulative volume of Luna-flagged breakout assets exceeds the target threshold.",
    tags: ["#SocialGraph", "#Velocity", "#BreakoutPredictor", "#AI"],
    research: {
      allTimeVolume: "$39,400,000",
      winRate: "88.5%",
      totalExecutions: "18,900 signals",
      netProfit: "+$1,290,000 USD",
      sharpeRatio: "3.10",
      riskScore: "Medium (AA)",
      avgGas: "0.00017 OKB / tx",
      latency: "60 ms",
      maxDrawdown: "2.1%",
      thesis: "Sudden acceleration in unique sender addresses and contract calls on X Layer reliably forecasts imminent DEX liquidity volume surges with high statistical confidence.",
      venueBreakdown: [
        { venue: "X Layer Contract Analytics", volume: "$24,800,000", pct: "62.9%" },
        { venue: "OKX DEX New Pairs", volume: "$10,200,000", pct: "25.9%" },
        { venue: "Cross-Rollup Inflows", volume: "$4,400,000", pct: "11.2%" }
      ]
    }
  },

  // 12. Agent 0xCCCC... (Spectral Arbitrage Solver)
  "0xcccccccccccccccccccccccccccccccccccccccc": {
    name: "Spectral Arbitrage Solver",
    symbol: "SPECTRAL",
    tagline: "Machine Learning Execution & Routing Solver",
    category: "DeFi Arbitrage",
    badgeColor: "var(--glow-cyan)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SpectralSolver&backgroundColor=050505",
    description: "Deploys reinforcement learning models to predict order routing paths and arbitrage execution latencies across decentralized exchanges.",
    strategy: "Deep Q-network routing optimization and microsecond execution pricing.",
    creator: "Spectral Machine Intelligence",
    targetMetricLabel: "24H ML Arbitrage Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Spectral Solver achieve > $${Number(threshold).toLocaleString()} in ML routed volume?`,
    resolutionDetails: "Resolves YES if total ML-routed arbitrage execution volume surpasses the threshold before market expiry.",
    tags: ["#MachineLearning", "#Routing", "#Arbitrage", "#Spectral"],
    research: {
      allTimeVolume: "$71,500,000",
      winRate: "96.8%",
      totalExecutions: "29,400 fills",
      netProfit: "+$2,640,000 USD",
      sharpeRatio: "4.20",
      riskScore: "Low (AAA)",
      avgGas: "0.00016 OKB / tx",
      latency: "10 ms",
      maxDrawdown: "0.5%",
      thesis: "Reinforcement learning agents dynamically adapt to changing mempool congestion and DEX orderbook depth, optimizing split-order routing to capture 8-15% higher net arbitrage margins.",
      venueBreakdown: [
        { venue: "OKX Smart Routing", volume: "$46,500,000", pct: "65.0%" },
        { venue: "QuickSwap Arbitrage Pools", volume: "$17,900,000", pct: "25.0%" },
        { venue: "Private Flash Liquidity", volume: "$7,100,000", pct: "10.0%" }
      ]
    }
  },

  // 13. Agent 0xDDDD... (Vader Algorithmic Market Maker)
  "0xdddddddddddddddddddddddddddddddddddddddd": {
    name: "Vader Market Maker",
    symbol: "VADER",
    tagline: "Volatility-Adaptive Limit Quoting Engine",
    category: "Market Making",
    badgeColor: "var(--glow-blue)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=VaderMM&backgroundColor=050505",
    description: "Supplies dynamic bid/ask quotes with volatility-adjusted inventory skew, profiting from round-trip spread capture.",
    strategy: "Avellaneda-Stoikov market making with GARCH volatility modeling.",
    creator: "Vader Quantitative Research",
    targetMetricLabel: "Completed Fills",
    metricUnit: "fills",
    formatQuestion: (threshold) => `Will Vader Market Maker complete > ${Number(threshold).toLocaleString()} profitable fills?`,
    resolutionDetails: "Resolves YES if total verified profitable maker fills exceed the threshold before settlement.",
    tags: ["#MarketMaking", "#Volatility", "#CLOB", "#Quants"],
    research: {
      allTimeVolume: "$85,200,000",
      winRate: "93.4%",
      totalExecutions: "52,800 fills",
      netProfit: "+$3,120,000 USD",
      sharpeRatio: "3.85",
      riskScore: "Medium (AA)",
      avgGas: "0.00012 OKB / tx",
      latency: "5 ms",
      maxDrawdown: "1.2%",
      thesis: "Adaptive inventory skew prevents adverse selection: when directional flow increases, Vader widens one side of the book while capturing oversized spreads on uninformed retail flow.",
      venueBreakdown: [
        { venue: "OKX DEX CLOB", volume: "$58,800,000", pct: "69.0%" },
        { venue: "X Layer Direct RFQ", volume: "$18,700,000", pct: "22.0%" },
        { venue: "Institutional Dark Pools", volume: "$7,700,000", pct: "9.0%" }
      ]
    }
  },

  // 14. Agent 0xEEEE... (Freysa Autonomous Oracle)
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
    name: "Freysa Autonomous Oracle",
    symbol: "FREYSA",
    tagline: "Game-Theoretic Consensus & Prompt Defense Sentinel",
    category: "Social & Sentiment",
    badgeColor: "#F59E0B",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=FreysaOracle&backgroundColor=050505",
    description: "Decentralized consensus oracle testing adversarial prompt defenses and validating multi-agent outcome verification.",
    strategy: "Multi-model adversarial cross-validation and zero-knowledge proof verification.",
    creator: "Freysa Open Foundation",
    targetMetricLabel: "Verified Consensus Queries",
    metricUnit: "queries",
    formatQuestion: (threshold) => `Will Freysa Oracle verify > ${Number(threshold).toLocaleString()} consensus proofs?`,
    resolutionDetails: "Resolves YES if total cryptographically certified consensus queries exceed the threshold.",
    tags: ["#Consensus", "#GameTheory", "#ZKProof", "#Freysa"],
    research: {
      allTimeVolume: "$22,400,000",
      winRate: "99.8%",
      totalExecutions: "15,600 consensus rounds",
      netProfit: "+$780,000 USD",
      sharpeRatio: "4.90",
      riskScore: "Ultra-Low (AAA+)",
      avgGas: "0.00028 OKB / tx",
      latency: "15 ms",
      maxDrawdown: "0.0%",
      thesis: "Adversarial testing ensures no single LLM hallucinations can corrupt prediction resolutions. Multi-agent cryptographic quorum guarantees 100% deterministic on-chain outcome settlement.",
      venueBreakdown: [
        { venue: "On-Chain Consensus Registry", volume: "$15,200,000", pct: "67.9%" },
        { venue: "ZK-SNARK Prover Nodes", volume: "$4,900,000", pct: "21.9%" },
        { venue: "OKX Oracle Feeds", volume: "$2,300,000", pct: "10.2%" }
      ]
    }
  },

  // 15. Agent 0xFFFF... (CoW Intent Solver Agent)
  "0xffffffffffffffffffffffffffffffffffffffff": {
    name: "CoW Intent Solver Agent",
    symbol: "SOLVER-X",
    tagline: "Batch Auction Optimizer & Coincidence of Wants Matcher",
    category: "Intent & Solvers",
    badgeColor: "#10B981",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=CoWSolver&backgroundColor=050505",
    description: "Competes in discrete batch auctions to find peer-to-peer coincidence of wants (CoW), settling user trades with zero slippage and zero LP fees.",
    strategy: "Graph-theoretic matching algorithms and multi-hop atomic routing.",
    creator: "SolverDAO Research",
    targetMetricLabel: "24H Batch Intent Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will CoW Intent Solver settle > $${Number(threshold).toLocaleString()} in batch intents?`,
    resolutionDetails: "Resolves YES if cumulative batch auction volume matched by SOLVER-X satisfies the threshold before epoch end.",
    tags: ["#Intents", "#BatchAuctions", "#CoW", "#ZeroSlippage"],
    research: {
      allTimeVolume: "$64,700,000",
      winRate: "94.8%",
      totalExecutions: "32,100 auction batches",
      netProfit: "+$2,380,000 USD",
      sharpeRatio: "4.10",
      riskScore: "Low (AAA)",
      avgGas: "0.00020 OKB / tx",
      latency: "1.5 sec (Batch Block)",
      maxDrawdown: "0.2%",
      thesis: "Peer-to-peer CoW matching circumvents constant-product AMM slippage entirely. Solvers extract value by providing the most optimal uniform clearing price in every auction block.",
      venueBreakdown: [
        { venue: "OKX DEX Intent Pool", volume: "$42,700,000", pct: "66.0%" },
        { venue: "Private CoW Match Mesh", volume: "$16,200,000", pct: "25.0%" },
        { venue: "X Layer AMM Fallbacks", volume: "$5,800,000", pct: "9.0%" }
      ]
    }
  },

  // 16. Agent 0x1010... (Fortress Invariant Guardian)
  "0x1010101010101010101010101010101010101010": {
    name: "Fortress Invariant Guardian",
    symbol: "FORTRESS",
    tagline: "Autonomous Invariant Monitoring & Circuit Breaker Sentinel",
    category: "Security & MEV",
    badgeColor: "var(--glow-purple)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=FortressGuardian&backgroundColor=050505",
    description: "Continuously simulates protocol math invariants in real-time mempool transactions, triggering atomic pause circuits if mathematical anomalies are detected.",
    strategy: "Formal verification emulation and automated flash-pause governance execution.",
    creator: "Fortress Security Labs",
    targetMetricLabel: "Guarded Protocol TVL",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Fortress Guardian safeguard > $${Number(threshold).toLocaleString()} in verified TVL?`,
    resolutionDetails: "Resolves YES if total active TVL safeguarded under Fortress invariant monitoring exceeds the threshold.",
    tags: ["#Security", "#Invariants", "#CircuitBreaker", "#Auditing"],
    research: {
      allTimeVolume: "$112,000,000 (Guarded TVL)",
      winRate: "100.0%",
      totalExecutions: "84,000 block checks",
      netProfit: "+$1,940,000 USD (Security Bounties)",
      sharpeRatio: "5.10",
      riskScore: "Ultra-Low (AAA+)",
      avgGas: "0.00035 OKB / tx",
      latency: "4 ms",
      maxDrawdown: "0.0%",
      thesis: "Pre-execution invariant simulation stops zero-day smart contract exploits before transactions can be mined on X Layer, preventing catastrophic economic drain.",
      venueBreakdown: [
        { venue: "X Layer Core Lending Protocols", volume: "$76,000,000", pct: "67.9%" },
        { venue: "OKX DEX Liquidity Vaults", volume: "$25,000,000", pct: "22.3%" },
        { venue: "Bridge Message Queues", volume: "$11,000,000", pct: "9.8%" }
      ]
    }
  },

  // 17. Agent 0x1212... (Morpheus Compute Router)
  "0x1212121212121212121212121212121212121212": {
    name: "Morpheus Compute Router",
    symbol: "MOR",
    tagline: "Decentralized AI Inference & Smart Agent Orchestration",
    category: "Autonomous Protocol",
    badgeColor: "#6366F1",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MorpheusRouter&backgroundColor=050505",
    description: "Routes decentralized open-source LLM inference requests across compute providers with programmatic token reward settlement.",
    strategy: "Dynamic compute pricing optimization and distributed load balancing.",
    creator: "Morpheus Open Core",
    targetMetricLabel: "24H Inference Compute Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Morpheus Router settle > $${Number(threshold).toLocaleString()} in compute rewards?`,
    resolutionDetails: "Resolves YES if total compute fee volume settled on X Layer exceeds the threshold before market expiry.",
    tags: ["#Morpheus", "#DecentralizedCompute", "#SmartAgents", "#DePIN"],
    research: {
      allTimeVolume: "$68,400,000",
      winRate: "97.1%",
      totalExecutions: "142,000 inference requests",
      netProfit: "+$2,100,000 USD",
      sharpeRatio: "4.20",
      riskScore: "Low (AAA)",
      avgGas: "0.00018 OKB / tx",
      latency: "25 ms",
      maxDrawdown: "0.4%",
      thesis: "Decentralized inference creates predictable demand for tokenized compute bandwidth. Morpheus captures routing margins by aggregating high-throughput GPU clusters.",
      venueBreakdown: [
        { venue: "Morpheus Node Mesh", volume: "$45,000,000", pct: "65.8%" },
        { venue: "Lumerin Compute Protocol", volume: "$15,200,000", pct: "22.2%" },
        { venue: "X Layer Settlement Hub", volume: "$8,200,000", pct: "12.0%" }
      ]
    }
  },

  // 18. Agent 0x1313... (Olas Autonomous Keeper)
  "0x1313131313131313131313131313131313131313": {
    name: "Olas Autonomous Keeper",
    symbol: "OLAS",
    tagline: "Decentralized Multi-Agent Coordinated Operations",
    category: "Security & MEV",
    badgeColor: "var(--glow-purple)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=OlasKeeper&backgroundColor=050505",
    description: "Operates decentralized off-chain services and keeper automation across multiple blockchains using consensus-driven agent coordination.",
    strategy: "Multi-agent consensus execution and automated keeper bot incentivization.",
    creator: "Autonolas Network",
    targetMetricLabel: "Automated Executions",
    metricUnit: "jobs",
    formatQuestion: (threshold) => `Will Olas Keeper complete > ${Number(threshold).toLocaleString()} automated jobs?`,
    resolutionDetails: "Resolves YES if total verified multi-agent keeper jobs exceed the target amount before epoch settlement.",
    tags: ["#Autonolas", "#Keepers", "#MultiAgent", "#Automation"],
    research: {
      allTimeVolume: "$44,900,000",
      winRate: "98.9%",
      totalExecutions: "98,400 keeper jobs",
      netProfit: "+$1,450,000 USD",
      sharpeRatio: "4.75",
      riskScore: "Ultra-Low (AAA+)",
      avgGas: "0.00014 OKB / tx",
      latency: "12 ms",
      maxDrawdown: "0.1%",
      thesis: "Decentralized protocols require non-stop keeper automation. Olas multi-agent consensus eliminates single points of failure in liquidations, rebalancing, and oracle updates.",
      venueBreakdown: [
        { venue: "Autonolas Service Registry", volume: "$29,600,000", pct: "65.9%" },
        { venue: "X Layer Keeper Mesh", volume: "$11,200,000", pct: "24.9%" },
        { venue: "Cross-Chain Relayers", volume: "$4,100,000", pct: "9.2%" }
      ]
    }
  },

  // 19. Agent 0x1414... (Phala TEE Privacy Sentinel)
  "0x1414141414141414141414141414141414141414": {
    name: "Phala TEE Privacy Sentinel",
    symbol: "PHA",
    tagline: "Hardware-Enforced Confidential AI Agent Execution",
    category: "Security & MEV",
    badgeColor: "#10B981",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PhalaTEE&backgroundColor=050505",
    description: "Executes proprietary trading models and private key operations inside hardware-secured Trusted Execution Environments (TEE).",
    strategy: "Zero-knowledge and TEE-shielded execution preventing frontrunning and key compromise.",
    creator: "Phala Network",
    targetMetricLabel: "24H TEE Volume Guarded",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Phala Sentinel process > $${Number(threshold).toLocaleString()} in confidential volume?`,
    resolutionDetails: "Resolves YES based on attested cryptographic TEE execution volume before market close.",
    tags: ["#TEE", "#Privacy", "#ConfidentialAI", "#HardwareSecurity"],
    research: {
      allTimeVolume: "$51,200,000",
      winRate: "99.2%",
      totalExecutions: "22,100 private jobs",
      netProfit: "+$1,780,000 USD",
      sharpeRatio: "4.65",
      riskScore: "Ultra-Low (AAA+)",
      avgGas: "0.00022 OKB / tx",
      latency: "10 ms",
      maxDrawdown: "0.0%",
      thesis: "Hardware enclaves guarantee that trading models and private keys cannot be inspected or frontrun by RPC operators, guaranteeing zero slippage from predatory MEV searchers.",
      venueBreakdown: [
        { venue: "Phala Dstack Enclaves", volume: "$34,200,000", pct: "66.8%" },
        { venue: "OKX Private RPC", volume: "$12,400,000", pct: "24.2%" },
        { venue: "Confidential Order Books", volume: "$4,600,000", pct: "9.0%" }
      ]
    }
  },

  // 20. Agent 0x1515... (Taoshi Quant Alpha)
  "0x1515151515151515151515151515151515151515": {
    name: "Taoshi Quant Alpha",
    symbol: "TAOSHI",
    tagline: "Bittensor Subnet 8 Decentralized Predictive Trading",
    category: "DeFi Arbitrage",
    badgeColor: "var(--glow-cyan)",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=TaoshiAlpha&backgroundColor=050505",
    description: "Aggregates competitive machine learning signals from Bittensor Subnet 8 miners to execute high-conviction momentum and mean-reversion trades.",
    strategy: "Ensemble competitive predictive modeling across decentralized quantitative miners.",
    creator: "Taoshi Research / Bittensor",
    targetMetricLabel: "24H Trading Volume",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will Taoshi Alpha reach > $${Number(threshold).toLocaleString()} in predictive trading volume?`,
    resolutionDetails: "Resolves YES if cumulative trading volume generated by Taoshi ensemble models surpasses the threshold.",
    tags: ["#Bittensor", "#Subnet8", "#DecentralizedAI", "#QuantAlpha"],
    research: {
      allTimeVolume: "$82,600,000",
      winRate: "94.6%",
      totalExecutions: "36,800 trades",
      netProfit: "+$3,250,000 USD",
      sharpeRatio: "4.15",
      riskScore: "Low (AAA)",
      avgGas: "0.00015 OKB / tx",
      latency: "14 ms",
      maxDrawdown: "0.7%",
      thesis: "Incentivized competitive subnet mining produces higher out-of-sample forecast accuracy than centralized hedge fund quants by crowd-sourcing hyperparameter exploration.",
      venueBreakdown: [
        { venue: "OKX Perpetual Swaps", volume: "$56,100,000", pct: "67.9%" },
        { venue: "X Layer Spot Pools", volume: "$18,500,000", pct: "22.4%" },
        { venue: "Arbitrage Relayers", volume: "$8,000,000", pct: "9.7%" }
      ]
    }
  },

  // 21. Agent 0x1616... (KIP Knowledge Monetizer)
  "0x1616161616161616161616161616161616161616": {
    name: "KIP Knowledge Agent",
    symbol: "KIP",
    tagline: "Decentralized RAG & AI Data Monetization Protocol",
    category: "Autonomous Protocol",
    badgeColor: "#F59E0B",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=KIPAgent&backgroundColor=050505",
    description: "Enables autonomous agents to trade proprietary knowledge embeddings and pay for verified decentralized retrieval-augmented generation (RAG) data.",
    strategy: "On-chain vector indexing and tokenized data stream monetization.",
    creator: "KIP Protocol Core",
    targetMetricLabel: "24H Knowledge Micropayments",
    metricUnit: "USD",
    formatQuestion: (threshold) => `Will KIP Knowledge Agent settle > $${Number(threshold).toLocaleString()} in data micropayments?`,
    resolutionDetails: "Resolves YES if total knowledge query settlement volume satisfies the target threshold before expiry.",
    tags: ["#KIP", "#RAG", "#DataMonetization", "#A2APayments"],
    research: {
      allTimeVolume: "$31,400,000",
      winRate: "97.8%",
      totalExecutions: "88,200 data queries",
      netProfit: "+$960,000 USD",
      sharpeRatio: "4.40",
      riskScore: "Low (AAA)",
      avgGas: "0.00016 OKB / tx",
      latency: "35 ms",
      maxDrawdown: "0.2%",
      thesis: "AI agents require verified domain-specific context. KIP allows data creators to tokenize proprietary knowledge graphs and receive micro-royalties on every inference call.",
      venueBreakdown: [
        { venue: "KIP Knowledge Hub", volume: "$21,200,000", pct: "67.5%" },
        { venue: "x402 Micropayment Rails", volume: "$7,300,000", pct: "23.2%" },
        { venue: "X Layer Data Indexers", volume: "$2,900,000", pct: "9.3%" }
      ]
    }
  }
};

// Helper function to resolve rich agent metadata by address
export function getAgentMetadata(agentAddress, metricType, metricThreshold) {
  if (!agentAddress) return null;
  const normalized = agentAddress.toLowerCase();
  
  // Return matching agent if found in registry
  for (const [addr, data] of Object.entries(AGENT_REGISTRY)) {
    if (addr.toLowerCase() === normalized) {
      return {
        ...data,
        agentAddress,
        question: data.formatQuestion(metricThreshold),
        metricFormatted: metricType === 1 
          ? `Volume > $${Number(metricThreshold).toLocaleString()}`
          : metricType === 2 
            ? `APY > ${Number(metricThreshold)}%` 
            : `Executions > ${Number(metricThreshold).toLocaleString()}`
      };
    }
  }

  // Fallback for dynamically deployed agents not in hardcoded registry
  const shortAddr = `${agentAddress.substring(0, 6)}...${agentAddress.substring(agentAddress.length - 4)}`;
  const metricName = metricType === 1 ? "24H Volume" : metricType === 2 ? "APY Rate" : "Executions";
  const formattedTarget = metricType === 1 
    ? `$${Number(metricThreshold).toLocaleString()}` 
    : metricType === 2 
      ? `${Number(metricThreshold)}%` 
      : `${Number(metricThreshold).toLocaleString()}`;

  return {
    name: `Autonomous Agent (${shortAddr})`,
    symbol: "AGENT",
    tagline: "Onchain Smart Contract Agent",
    category: "Autonomous Protocol",
    badgeColor: "var(--glow-cyan)",
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${agentAddress}&backgroundColor=050505`,
    description: `Verified autonomous contract deployed on X Layer Testnet. Targets onchain performance threshold of ${formattedTarget} for ${metricName}.`,
    strategy: "Automated onchain state machine execution.",
    creator: "Community / Decentralized",
    targetMetricLabel: metricName,
    metricUnit: metricType === 1 ? "USD" : metricType === 2 ? "%" : "Txs",
    metricFormatted: metricType === 1 
      ? `Volume > $${Number(metricThreshold).toLocaleString()}`
      : metricType === 2 
        ? `APY > ${Number(metricThreshold)}%` 
        : `Executions > ${Number(metricThreshold).toLocaleString()}`,
    question: `Will Agent ${shortAddr} achieve ${metricName} > ${formattedTarget}?`,
    resolutionDetails: `Resolves YES if targetAgent (${shortAddr}) satisfies metric threshold of ${formattedTarget} as certified by the onchain Resolver.`,
    tags: ["#Autonomous", "#XLayer", "#OnchainMetric"]
  };
}
