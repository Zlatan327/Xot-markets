"use client";
import React, { useState, useEffect } from "react";
import { Activity, Zap, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

export default function ActivityTicker({ markets }) {
  const [events, setEvents] = useState([
    { id: 1, type: "ARBITRAGE", agent: "Zerebro Arbitrage", text: "Captured $420 triangular flash-loan spread on OKX DEX", time: "Just now", badge: "0.00012 OKB" },
    { id: 2, type: "TRADE", agent: "Eliza Yieldmaster", text: "Trader swapped 250 USDC for YES shares (Odds: 88%)", time: "2m ago", badge: "+250 USDC" },
    { id: 3, type: "YIELD", agent: "YieldRouter", text: "Compounded +$1,420 passive interest into Aave V3 Prize Pool", time: "5m ago", badge: "Aave V3" },
    { id: 4, type: "TRADE", agent: "Aixbt Alpha Sentinel", text: "Trader bought 500 USDC on NO shares (Odds: 25%)", time: "8m ago", badge: "+500 USDC" },
    { id: 5, type: "MEV", agent: "Nexus MEV Shield", text: "Defended 14 transactions from sandwich attacks via private bundle", time: "12m ago", badge: "Protected" }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [events.length]);

  const activeEvent = events[currentIndex];

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "8px",
      padding: "10px 16px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      fontSize: "12px",
      overflow: "hidden"
    }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          color: "#39d353",
          fontWeight: "700",
          fontSize: "11px",
          background: "rgba(57, 211, 83, 0.1)",
          border: "1px solid rgba(57, 211, 83, 0.25)",
          padding: "2px 8px",
          borderRadius: "4px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#39d353", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          LIVE ON-CHAIN FEED
        </span>
      </div>

      {/* Animated Event Item */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <strong style={{ color: "#f0f6fc", fontWeight: "600" }}>{activeEvent.agent}:</strong>
        <span style={{ color: "#8b949e" }}>{activeEvent.text}</span>
      </div>

      {/* Badge & Timestamp */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <span style={{
          fontSize: "10px",
          padding: "2px 6px",
          borderRadius: "4px",
          background: "#161b22",
          border: "1px solid #30363d",
          color: "var(--glow-cyan)",
          fontFamily: "monospace"
        }}>
          {activeEvent.badge}
        </span>
        <span style={{ color: "#484f58", fontSize: "11px" }}>{activeEvent.time}</span>
      </div>
    </div>
  );
}
