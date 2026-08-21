"use client";
import React, { useState } from "react";
import { BookOpen, Sparkles, TrendingUp, ShieldCheck, Cpu, Terminal } from "lucide-react";

export default function ProtocolDocsModal({ onClose }) {
  const [activeSection, setActiveSection] = useState("PARI_MUTUEL");

  const sections = [
    { id: "PARI_MUTUEL", title: "1. Pari-Mutuel Prediction Mechanics", icon: TrendingUp },
    { id: "YIELD_ROUTING", title: "2. Aave V3 Yield Compounding", icon: Sparkles },
    { id: "MCP_AGENT", title: "3. AI Agent Integration (MCP)", icon: Terminal },
    { id: "ORACLE_DISPUTE", title: "4. Optimistic Dispute Oracle", icon: ShieldCheck }
  ];

  return (
    <div className="modal-backdrop" style={{
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
      <div className="modal-panel docs-panel" style={{
        backgroundColor: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "840px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
        padding: "32px",
        color: "#f0f6fc",
        position: "relative",
        animation: "fadeIn 0.2s ease-out"
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ background: "rgba(0, 240, 255, 0.1)", color: "var(--glow-cyan)", padding: "6px", borderRadius: "8px" }}>
                <BookOpen size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Xot Markets Protocol Documentation</h2>
            </div>
            <p style={{ margin: "6px 0 0 0", color: "#8b949e", fontSize: "13px" }}>
              Technical architecture, pari-mutuel payout formulas, yield routing, and autonomous agent settlement.
            </p>
          </div>

          <button onClick={onClose} style={{
            background: "#161b22",
            border: "1px solid #30363d",
            color: "#8b949e",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            ✕
          </button>
        </div>

        {/* Section Navigation */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #21262d", marginBottom: "20px", paddingBottom: "12px", overflowX: "auto" }}>
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  background: activeSection === s.id ? "#21262d" : "transparent",
                  color: activeSection === s.id ? "var(--glow-cyan)" : "#8b949e",
                  border: activeSection === s.id ? "1px solid #30363d" : "1px solid transparent",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap"
                }}
              >
                <Icon size={14} /> {s.title}
              </button>
            );
          })}
        </div>

        {/* Section 1: Pari-Mutuel */}
        {activeSection === "PARI_MUTUEL" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", lineHeight: "1.6", color: "#c9d1d9" }}>
            <div style={{ background: "#161b22", padding: "18px", borderRadius: "10px", border: "1px solid #21262d" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#58a6ff", fontSize: "15px" }}>How Pari-Mutuel Odds Work</h3>
              <p style={{ margin: 0 }}>
                Unlike fixed-odds bookmakers that take counter-party risk, Xot Markets operates a <strong>pure pari-mutuel liquidity pool</strong>. All user bets are pooled together into the smart contract.
              </p>
              <div style={{ background: "#0d1117", padding: "12px", borderRadius: "6px", fontFamily: "monospace", margin: "12px 0", border: "1px solid #21262d", color: "#39d353" }}>
                Payout = (UserShares * (TotalYesPool + TotalNoPool)) / TotalWinningPool
              </div>
              <p style={{ margin: 0 }}>
                A 1.5% protocol fee is routed directly to the treasury on deposits. Winners share 100% of the net pooled collateral proportionally to their stake.
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Yield Routing */}
        {activeSection === "YIELD_ROUTING" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", lineHeight: "1.6", color: "#c9d1d9" }}>
            <div style={{ background: "#161b22", padding: "18px", borderRadius: "10px", border: "1px solid #21262d" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#39d353", fontSize: "15px" }}>Idle Collateral Aave V3 Routing</h3>
              <p style={{ margin: 0 }}>
                While prediction markets wait for the resolution epoch, collateral sitting idle in the contract is routed via the <strong>YieldRouter.sol</strong> into Aave V3 lending pools on X Layer.
              </p>
              <ul style={{ margin: "10px 0 0 0", paddingLeft: "20px" }}>
                <li><strong>Principal Protected:</strong> User deposits are never lent with directional risk.</li>
                <li><strong>Passive APY:</strong> Generates interest on total TVL ($290,000+ USDC).</li>
                <li><strong>Auto-Withdrawal:</strong> When markets expire, collateral is un-supplied back to the market contract ready for instant user claim.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 3: MCP Agent Integration */}
        {activeSection === "MCP_AGENT" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", lineHeight: "1.6", color: "#c9d1d9" }}>
            <div style={{ background: "#161b22", padding: "18px", borderRadius: "10px", border: "1px solid #21262d" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "var(--glow-cyan)", fontSize: "15px" }}>Model Context Protocol (MCP) Server</h3>
              <p style={{ margin: 0 }}>
                Any AI agent (Claude Desktop, Cursor, Gemini, GPT-4) can interact autonomously with Xot Markets via our native MCP Server (`mcp-server/index.js`).
              </p>
              <div style={{ background: "#0d1117", padding: "12px", borderRadius: "6px", fontFamily: "monospace", margin: "12px 0", border: "1px solid #21262d" }}>
                <span style={{ color: "#8b949e" }}>// Supported MCP Tools</span><br/>
                • <strong style={{ color: "#58a6ff" }}>get_markets</strong>: Query active prediction markets<br/>
                • <strong style={{ color: "#58a6ff" }}>get_market_details</strong>: Read live pool sizes & odds<br/>
                • <strong style={{ color: "#58a6ff" }}>create_market</strong>: Deploy new prediction market on-chain<br/>
                • <strong style={{ color: "#58a6ff" }}>trade</strong>: Execute YES/NO bets with agent wallet<br/>
                • <strong style={{ color: "#58a6ff" }}>resolve</strong>: Trigger oracle settlement
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Oracle & Disputes */}
        {activeSection === "ORACLE_DISPUTE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", lineHeight: "1.6", color: "#c9d1d9" }}>
            <div style={{ background: "#161b22", padding: "18px", borderRadius: "10px", border: "1px solid #21262d" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#e3b341", fontSize: "15px" }}>Optimistic Settlement & 4-Hour Dispute Window</h3>
              <p style={{ margin: 0 }}>
                When a market reaches `expiryBlock`, `Resolver.sol` inspects on-chain metric registries (`IAgentRegistry` / `IReputationEngine`) and proposes an outcome (YES or NO).
              </p>
              <ul style={{ margin: "10px 0 0 0", paddingLeft: "20px" }}>
                <li><strong>4-Hour Window:</strong> The proposed outcome remains open for optimistic challenge.</li>
                <li><strong>Dispute Bond:</strong> Anyone can challenge by posting a 500 USDC bond.</li>
                <li><strong>Finalization:</strong> If unchallenged after 4 hours, anyone or the Keeper calls `finalizeResolution()` to unlock instant payout claims.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", borderTop: "1px solid #21262d", paddingTop: "16px" }}>
          <button onClick={onClose} style={{
            background: "#21262d",
            color: "#c9d1d9",
            border: "1px solid #30363d",
            padding: "8px 18px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
}
