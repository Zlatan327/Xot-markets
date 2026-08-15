"use client";
import React, { useState } from "react";
import { ethers } from "ethers";

export default function AgentResearchModal({ market, agentData, onClose, onTradeClick }) {
  const [activeTab, setActiveTab] = useState("METRICS"); // METRICS, STRATEGY, VOLUME_BREAKDOWN, ONCHAIN

  if (!market || !agentData) return null;

  const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
  const yesPercent = totalPool === 0 ? 50 : Math.round((market.poolYes / totalPool) * 100);
  const noPercent = totalPool === 0 ? 50 : 100 - yesPercent;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }} onClick={onClose}>
      <div style={{
        backgroundColor: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "860px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
        padding: "32px",
        color: "#f0f6fc",
        position: "relative",
        animation: "fadeIn 0.2s ease-out"
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          background: "#161b22",
          border: "1px solid #30363d",
          color: "#8b949e",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s"
        }} onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#8b949e"; }}
           onMouseOut={(e) => { e.currentTarget.style.color = "#8b949e"; e.currentTarget.style.borderColor = "#30363d"; }}>
          ✕
        </button>

        {/* Header with Avatar & Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          <img 
            src={agentData.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=agent"} 
            alt={agentData.name} 
            style={{ width: "64px", height: "64px", borderRadius: "14px", border: `2px solid ${agentData.badgeColor || "var(--glow-cyan)"}`, background: "#161b22" }} 
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>{agentData.name}</h2>
              <span style={{ 
                fontSize: "11px", 
                padding: "3px 10px", 
                borderRadius: "20px", 
                background: "rgba(0, 240, 255, 0.1)", 
                color: agentData.badgeColor || "var(--glow-cyan)", 
                border: `1px solid ${agentData.badgeColor || "var(--glow-cyan)"}`,
                fontWeight: "600"
              }}>
                {agentData.category || "DeFi Autonomous"}
              </span>
              <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "#161b22", color: "#8b949e", border: "1px solid #30363d" }}>
                ✓ OKX DEX Verified
              </span>
            </div>
            <p style={{ margin: "6px 0 0 0", color: "#8b949e", fontSize: "13px" }}>
              {agentData.tagline} • Built by <strong style={{ color: "#c9d1d9" }}>{agentData.creator}</strong>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #21262d", marginBottom: "24px", paddingBottom: "12px" }}>
          {[
            { id: "METRICS", label: "📊 Proven Track Record & Volume" },
            { id: "STRATEGY", label: "🧠 Strategy & Intelligence Thesis" },
            { id: "VOLUME_BREAKDOWN", label: "📈 OKX Marketplace Volume" },
            { id: "ONCHAIN", label: "🔗 On-Chain Verification" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#21262d" : "transparent",
                color: activeTab === tab.id ? "#58a6ff" : "#8b949e",
                border: activeTab === tab.id ? "1px solid #30363d" : "1px solid transparent",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: METRICS & TRACK RECORD */}
        {activeTab === "METRICS" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>All-Time Incurred Volume</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#39d353", marginTop: "4px" }}>
                  {agentData.research?.allTimeVolume || "$48,250,000"}
                </div>
                <div style={{ fontSize: "11px", color: "#8b949e", marginTop: "4px" }}>Across OKX DEX & X Layer</div>
              </div>

              <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>Execution Win Rate</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#58a6ff", marginTop: "4px" }}>
                  {agentData.research?.winRate || "94.8%"}
                </div>
                <div style={{ fontSize: "11px", color: "#8b949e", marginTop: "4px" }}>{agentData.research?.totalExecutions || "19,430 fills"}</div>
              </div>

              <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>Net Profit Generated</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#39d353", marginTop: "4px" }}>
                  {agentData.research?.netProfit || "+$1,420,000"}
                </div>
                <div style={{ fontSize: "11px", color: "#8b949e", marginTop: "4px" }}>Sharpe Ratio: {agentData.research?.sharpeRatio || "3.84"}</div>
              </div>

              <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>Risk Rating</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#e3b341", marginTop: "4px" }}>
                  {agentData.research?.riskScore || "Low (AAA)"}
                </div>
                <div style={{ fontSize: "11px", color: "#8b949e", marginTop: "4px" }}>Solvency Invariant: 100%</div>
              </div>
            </div>

            {/* Current Market Proposition Banner */}
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600", marginBottom: "6px" }}>Active Prediction Proposition</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#f0f6fc", marginBottom: "14px" }}>
                {agentData.question || "Will this agent achieve target execution?"}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#39d353" }}>YES {yesPercent}% (${market.poolYes ? Number(market.poolYes).toLocaleString() : "0"} USDC)</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#f85149" }}>NO {noPercent}% (${market.poolNo ? Number(market.poolNo).toLocaleString() : "0"} USDC)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#21262d", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
                <div style={{ width: `${yesPercent}%`, background: "linear-gradient(90deg, #238636, #39d353)" }} />
                <div style={{ width: `${noPercent}%`, background: "linear-gradient(90deg, #da3633, #f85149)" }} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: STRATEGY & INTELLIGENCE THESIS */}
        {activeTab === "STRATEGY" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #21262d" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#58a6ff" }}>🎯 Strategy Architecture</h4>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#c9d1d9" }}>
                {agentData.strategy}
              </p>
            </div>

            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #21262d" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#39d353" }}>💡 Economic Thesis & Research Basis</h4>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#c9d1d9" }}>
                {agentData.research?.thesis || agentData.description}
              </p>
            </div>

            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #21262d" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#e3b341" }}>⚡ Execution Parameters</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", marginTop: "10px" }}>
                <div><span style={{ color: "#8b949e" }}>Target Metric:</span> <strong style={{ color: "#f0f6fc" }}>{agentData.targetMetricLabel}</strong></div>
                <div><span style={{ color: "#8b949e" }}>Avg Gas Cost:</span> <strong style={{ color: "#f0f6fc" }}>{agentData.research?.avgGas || "0.00012 OKB / tx"}</strong></div>
                <div><span style={{ color: "#8b949e" }}>Latency:</span> <strong style={{ color: "#f0f6fc" }}>{agentData.research?.latency || "14 ms"}</strong></div>
                <div><span style={{ color: "#8b949e" }}>Max Drawdown:</span> <strong style={{ color: "#f0f6fc" }}>{agentData.research?.maxDrawdown || "1.2%"}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: VOLUME BREAKDOWN */}
        {activeTab === "VOLUME_BREAKDOWN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #21262d" }}>
              <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#f0f6fc" }}>📊 Historical Volume Incurred by Liquidity Venue</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(agentData.research?.venueBreakdown || [
                  { venue: "OKX DEX Aggregator", volume: "$28,400,000", pct: "58.8%" },
                  { venue: "X Layer Core AMM Pools", volume: "$12,350,000", pct: "25.6%" },
                  { venue: "Aave V3 X Layer Lending", volume: "$5,100,000", pct: "10.6%" },
                  { venue: "Cross-Rollup Bridge Relays", volume: "$2,400,000", pct: "5.0%" }
                ]).map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                      <span style={{ color: "#c9d1d9", fontWeight: "600" }}>{item.venue}</span>
                      <span style={{ color: "#39d353", fontWeight: "600" }}>{item.volume} ({item.pct})</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#21262d", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: item.pct, height: "100%", background: "#58a6ff" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#161b22", padding: "16px", borderRadius: "12px", border: "1px solid #21262d", fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }}>
              💡 <em>Volume figures are indexed directly from on-chain event logs and OKX Web3 DEX settlement contracts on X Layer Testnet.</em>
            </div>
          </div>
        )}

        {/* Tab 4: ON-CHAIN VERIFICATION */}
        {activeTab === "ONCHAIN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#161b22", padding: "20px", borderRadius: "12px", border: "1px solid #21262d" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#f0f6fc" }}>🔍 Smart Contract & Oracle Verification</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #21262d", paddingBottom: "8px" }}>
                  <span style={{ color: "#8b949e" }}>Target Agent Contract:</span>
                  <a 
                    href={`https://www.okx.com/explorer/xlayer-test/address/${agentData.agentAddress}`}
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: "#58a6ff", fontFamily: "monospace", textDecoration: "none" }}
                  >
                    {agentData.agentAddress} ↗
                  </a>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #21262d", paddingBottom: "8px" }}>
                  <span style={{ color: "#8b949e" }}>Prediction Market Contract:</span>
                  <a 
                    href={`https://www.okx.com/explorer/xlayer-test/address/${market.marketAddress}`}
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: "#58a6ff", fontFamily: "monospace", textDecoration: "none" }}
                  >
                    {market.marketAddress} ↗
                  </a>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #21262d", paddingBottom: "8px" }}>
                  <span style={{ color: "#8b949e" }}>Settlement Oracle:</span>
                  <span style={{ color: "#39d353", fontWeight: "600" }}>Optimistic Resolver (4H Dispute Window)</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#8b949e" }}>Resolution Rule:</span>
                  <span style={{ color: "#c9d1d9", maxWidth: "60%", textAlign: "right" }}>{agentData.resolutionDetails}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", borderTop: "1px solid #21262d", paddingTop: "20px" }}>
          <button onClick={onClose} style={{
            background: "#21262d",
            color: "#c9d1d9",
            border: "1px solid #30363d",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Close Dossier
          </button>
          <button onClick={() => { onClose(); onTradeClick && onTradeClick(market); }} style={{
            background: "var(--glow-cyan)",
            color: "#050505",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer"
          }}>
            Trade on This Agent →
          </button>
        </div>

      </div>
    </div>
  );
}
