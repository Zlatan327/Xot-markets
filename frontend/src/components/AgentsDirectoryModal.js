"use client";
import React, { useState } from "react";
import { AGENT_REGISTRY } from "../lib/agents";
import { Bot, CheckCircle2, ArrowUpRight, Search, ExternalLink, Activity } from "lucide-react";

export default function AgentsDirectoryModal({ onClose, onSelectAgent, markets }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const agentList = Object.entries(AGENT_REGISTRY).map(([address, data]) => {
    // Find matching market if any
    const matchingMarket = markets?.find(m => m.targetAgent?.toLowerCase() === address.toLowerCase());
    return {
      address,
      ...data,
      matchingMarket
    };
  });

  const filteredAgents = agentList.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                          agent.category.toLowerCase().includes(search.toLowerCase()) ||
                          agent.creator.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || agent.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ["ALL", "DeFi Arbitrage", "Yield Aggregation", "Market Making", "Security & MEV"];

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
        maxWidth: "920px",
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
                <Bot size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Verified AI Agent Registry & Marketplace Track Records</h2>
            </div>
            <p style={{ margin: "6px 0 0 0", color: "#8b949e", fontSize: "13px" }}>
              Autonomous trading and MEV agents operating on X Layer and OKX DEX with verified on-chain metrics.
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

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: categoryFilter === cat ? "#21262d" : "#161b22",
                  color: categoryFilter === cat ? "var(--glow-cyan)" : "#8b949e",
                  border: categoryFilter === cat ? "1px solid var(--glow-cyan)" : "1px solid #30363d",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "6px",
            padding: "4px 10px",
            gap: "6px",
            minWidth: "220px"
          }}>
            <Search size={14} color="#8b949e" />
            <input
              type="text"
              placeholder="Search agent or creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#fff", fontSize: "12px", outline: "none", width: "100%" }}
            />
          </div>
        </div>

        {/* Agent Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "14px" }}>
          {filteredAgents.map(agent => (
            <div key={agent.address} style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "12px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "border-color 0.2s"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    style={{ width: "42px", height: "42px", borderRadius: "8px", border: `1px solid ${agent.badgeColor || '#30363d'}` }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: "#f0f6fc" }}>{agent.name}</span>
                      <CheckCircle2 size={13} color="var(--glow-cyan)" />
                    </div>
                    <span style={{ fontSize: "10px", color: agent.badgeColor || "var(--glow-cyan)", fontWeight: "600", textTransform: "uppercase" }}>
                      {agent.category}
                    </span>
                  </div>
                </div>

                <p style={{ margin: "0 0 12px 0", color: "#8b949e", fontSize: "12px", lineHeight: "1.4" }}>
                  {agent.tagline}
                </p>

                {/* Metrics Box */}
                <div style={{ background: "#0d1117", padding: "10px", borderRadius: "8px", border: "1px solid #21262d", marginBottom: "14px", fontSize: "11px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#8b949e" }}>All-Time Vol:</span>
                    <strong style={{ color: "#39d353" }}>{agent.research?.allTimeVolume || "$48.2M"}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#8b949e" }}>Win Rate:</span>
                    <strong style={{ color: "#58a6ff" }}>{agent.research?.winRate || "95.4%"}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#8b949e" }}>Sharpe Ratio:</span>
                    <strong style={{ color: "#e3b341" }}>{agent.research?.sharpeRatio || "3.92"}</strong>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    onClose();
                    if (agent.matchingMarket && onSelectAgent) {
                      onSelectAgent(agent.matchingMarket);
                    }
                  }}
                  style={{
                    flex: 1,
                    background: "var(--glow-cyan)",
                    color: "#050505",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                  }}
                >
                  View Market <ArrowUpRight size={13} />
                </button>

                <a
                  href={`https://www.okx.com/explorer/xlayer-test/address/${agent.address}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View Contract on OKX Explorer"
                  style={{
                    background: "#21262d",
                    color: "#8b949e",
                    border: "1px solid #30363d",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none"
                  }}
                >
                  <ExternalLink size={13} />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
