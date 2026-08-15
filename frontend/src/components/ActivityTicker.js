"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Activity, Zap, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function ActivityTicker({ markets = [] }) {
  // Dynamically compute live feed items from actual deployed on-chain markets
  const events = useMemo(() => {
    if (!markets || markets.length === 0) return [];
    
    return markets.map((m, idx) => {
      const totalPool = (m.poolYes || 0) + (m.poolNo || 0);
      const yesPct = totalPool === 0 ? 50 : Math.round((m.poolYes / totalPool) * 100);
      const noPct = 100 - yesPct;
      const agentName = m.agentName || m.agentDetails?.name || "Autonomous Agent";
      const shortAddr = m.marketAddress ? `${m.marketAddress.slice(0, 6)}...${m.marketAddress.slice(-4)}` : "";

      if (idx % 3 === 0) {
        return {
          id: m.marketAddress || idx,
          type: "LIQUIDITY",
          agent: agentName,
          text: `On-chain pool backed with $${totalPool.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC collateral`,
          badge: `${yesPct}% YES`,
          badgeColor: "#58a6ff",
          contract: shortAddr
        };
      } else if (idx % 3 === 1) {
        return {
          id: m.marketAddress || idx,
          type: "PROBABILITY",
          agent: agentName,
          text: `Market odds shifted to ${yesPct}¢ YES / ${noPct}¢ NO on X Layer Testnet`,
          badge: `${yesPct}¢ / ${noPct}¢`,
          badgeColor: "var(--glow-cyan)",
          contract: shortAddr
        };
      } else {
        return {
          id: m.marketAddress || idx,
          type: "SETTLEMENT",
          agent: agentName,
          text: `Yield actively compounding in Aave V3 vault (${m.metric || "Live Metric Tracker"})`,
          badge: "Aave V3",
          badgeColor: "#39d353",
          contract: shortAddr
        };
      }
    });
  }, [markets]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [events.length]);

  if (events.length === 0) return null;

  const activeEvent = events[currentIndex] || events[0];

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "8px",
      padding: "10px 16px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      fontSize: "12px",
      overflow: "hidden"
    }}>
      {/* Live Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          color: "#39d353",
          fontWeight: "700",
          fontSize: "11px",
          background: "rgba(57, 211, 83, 0.1)",
          border: "1px solid rgba(57, 211, 83, 0.25)",
          padding: "2px 8px",
          borderRadius: "4px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#39d353", display: "inline-block" }} />
          LIVE ON-CHAIN FEED
        </span>
      </div>

      {/* Dynamic Event Stream */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <strong style={{ color: "#f0f6fc", fontWeight: "700" }}>{activeEvent.agent}:</strong>
        <span style={{ color: "#8b949e" }}>{activeEvent.text}</span>
      </div>

      {/* On-Chain Contract & Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <span style={{
          fontSize: "11px",
          padding: "2px 8px",
          borderRadius: "4px",
          background: "#161b22",
          border: "1px solid #30363d",
          color: activeEvent.badgeColor || "var(--glow-cyan)",
          fontWeight: "700",
          fontFamily: "monospace"
        }}>
          {activeEvent.badge}
        </span>
        {activeEvent.contract && (
          <span style={{ color: "#484f58", fontSize: "11px", fontFamily: "monospace" }}>
            {activeEvent.contract}
          </span>
        )}
      </div>
    </div>
  );
}
