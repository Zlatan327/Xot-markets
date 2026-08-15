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
    tags: ["#FlashLoans", "#Arbitrage", "#HighFrequency", "#XLayer"]
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
    tags: ["#Aave", "#Yield", "#DeltaNeutral", "#Compounding"]
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
    tags: ["#Sentiment", "#Orderflow", "#MarketMaking", "#Mempool"]
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
    tags: ["#MEV", "#Security", "#PrivateRPC", "#A2A"]
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
