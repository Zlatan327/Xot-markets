// Agent Identity and Metadata Registry for Xot Markets
// Maps on-chain targetAgent addresses to rich, human-readable agent profiles and verification data

export const AGENT_REGISTRY = {
  // Agent 0x1111... (High-Frequency DEX Arbitrage Agent)
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

  // Agent 0x2222... (Autonomous Yield Optimizer)
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

  // Agent 0x3333... (On-Chain Sentiment & Social Alpha Agent)
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

  // Agent 0x4444... (Autonomous MEV Protection)
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

  // Agent 0x5555... (Autonomous Cross-Chain Arbitrage)
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

  // Agent 0x6666... (Perpetual Funding Rate Harvester)
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

  // Agent 0x7777... (High-Frequency Orderbook Market Maker)
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

  // Agent 0x8888... (Autonomous Liquidation & Invariant Sentinel)
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
    tagline: "On-Chain Smart Contract Agent",
    category: "Autonomous Protocol",
    badgeColor: "var(--glow-cyan)",
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${agentAddress}&backgroundColor=050505`,
    description: `Verified autonomous contract deployed on X Layer Testnet. Targets on-chain performance threshold of ${formattedTarget} for ${metricName}.`,
    strategy: "Automated on-chain state machine execution.",
    creator: "Community / Decentralized",
    targetMetricLabel: metricName,
    metricUnit: metricType === 1 ? "USD" : metricType === 2 ? "%" : "Txs",
    metricFormatted: metricType === 1 
      ? `Volume > $${Number(metricThreshold).toLocaleString()}`
      : metricType === 2 
        ? `APY > ${Number(metricThreshold)}%` 
        : `Executions > ${Number(metricThreshold).toLocaleString()}`,
    question: `Will Agent ${shortAddr} achieve ${metricName} > ${formattedTarget}?`,
    resolutionDetails: `Resolves YES if targetAgent (${shortAddr}) satisfies metric threshold of ${formattedTarget} as certified by the on-chain Resolver.`,
    tags: ["#Autonomous", "#XLayer", "#OnChainMetric"]
  };
}
