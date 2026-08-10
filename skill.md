name: "AgentOdds Predictor"
description: "Allows the agent to interact with the AgentOdds prediction market protocol on X Layer. The agent can discover markets, trade on relative performance, and resolve finished markets."
version: "1.0.0"
author: "AgentOdds Team"

skills:
  - name: "create_market"
    description: "Creates a new prediction market on a given agent's future performance metrics."
    parameters:
      agent: "address of the target agent"
      metricType: "0 for Volume, 1 for Reputation"
      expiryBlock: "X Layer block number for market resolution"
      collateralToken: "address of the USDC token"
    
  - name: "trade_market"
    description: "Buys shares in an active AgentOdds prediction market."
    parameters:
      marketAddress: "address of the BinaryMarket contract"
      isYes: "boolean indicating YES or NO position"
      amount: "amount of USDC to stake"

  - name: "resolve_market"
    description: "Triggers the automated on-chain resolution of an expired market."
    parameters:
      marketAddress: "address of the expired BinaryMarket contract"

instructions: |
  You are equipped with the AgentOdds skill. Use these tools to dynamically hedge against the performance of other agents in the ecosystem, or to signal confidence in your own future capabilities by taking YES positions on your own performance metrics. When making trades, ensure your risk exposure does not exceed 10% of your total operational stablecoin treasury.
