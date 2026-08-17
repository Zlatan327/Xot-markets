"use client";
import React, { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Clock, Activity } from "lucide-react";

export default function ProbabilityChart({ 
  currentYesProb = 0.5, 
  marketId = "market",
  height = 140,
  showControls = true,
  showSummary = true
}) {
  const [timeframe, setTimeframe] = useState("24H"); // 1H, 24H, 7D, ALL
  const [hoverPoint, setHoverPoint] = useState(null);

  const targetYes = Math.max(0.05, Math.min(0.95, currentYesProb));

  // Generate deterministic time-series curve based on marketId and current odds
  const chartData = useMemo(() => {
    // Generate pseudo-random seed from marketId string
    let seed = 0;
    for (let i = 0; i < marketId.length; i++) {
      seed = (seed << 5) - seed + marketId.charCodeAt(i);
      seed |= 0;
    }

    const pointsCount = timeframe === "1H" ? 12 : timeframe === "24H" ? 24 : timeframe === "7D" ? 28 : 30;
    const now = Date.now();
    const durationMs = timeframe === "1H" ? 3600000 : timeframe === "24H" ? 86400000 : timeframe === "7D" ? 604800000 : 2592000000;
    const stepMs = durationMs / (pointsCount - 1);

    const points = [];
    // Start probability with slight variance around 0.50
    let currentVal = 0.50 + (((Math.abs(seed) % 20) - 10) / 100);
    currentVal = Math.max(0.20, Math.min(0.80, currentVal));

    for (let i = 0; i < pointsCount; i++) {
      const t = now - (pointsCount - 1 - i) * stepMs;
      const progress = i / (pointsCount - 1);

      // Smooth drift toward current real onchain probability
      const drift = (targetYes - currentVal) * (0.15 + progress * 0.4);
      const noise = ((Math.sin(seed * (i + 1)) * 43758.5453) % 1) * 0.04 - 0.02;
      
      currentVal = currentVal + drift + noise;
      currentVal = Math.max(0.04, Math.min(0.96, currentVal));

      if (i === pointsCount - 1) {
        currentVal = targetYes; // Final point is exact onchain probability
      }

      points.push({
        time: t,
        prob: currentVal,
        probPercent: Math.round(currentVal * 100),
        label: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateLabel: new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      });
    }
    return points;
  }, [marketId, targetYes, timeframe]);

  // SVG Geometry Calculations
  const paddingX = 10;
  const paddingY = 14;
  const svgWidth = 360;
  const svgHeight = height;

  const minProb = Math.min(...chartData.map(d => d.prob)) * 0.9;
  const maxProb = Math.max(...chartData.map(d => d.prob)) * 1.1;
  const probRange = Math.max(0.1, maxProb - minProb);

  const getCoordinates = (point, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((point.prob - minProb) / probRange) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  const coords = chartData.map((d, i) => getCoordinates(d, i));

  // Build SVG Path with smooth curves
  const linePath = coords.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight} L ${coords[0].x} ${svgHeight} Z`;

  const activeDataPoint = hoverPoint !== null ? chartData[hoverPoint] : chartData[chartData.length - 1];
  const activeCoord = hoverPoint !== null ? coords[hoverPoint] : coords[coords.length - 1];

  const firstPoint = chartData[0];
  const lastPoint = chartData[chartData.length - 1];
  const changePercent = lastPoint.probPercent - firstPoint.probPercent;
  const isPositive = changePercent >= 0;

  return (
    <div style={{
      width: "100%",
      background: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "8px",
      padding: "12px",
      position: "relative",
      userSelect: "none"
    }}>
      {/* Chart Top Header */}
      {showSummary && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#58a6ff" }}>
                {activeDataPoint.probPercent}%
              </span>
              <span style={{ fontSize: "11px", color: "#8b949e", fontWeight: "600" }}>YES PROBABILITY</span>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                color: isPositive ? "#39d353" : "#f85149",
                display: "flex",
                alignItems: "center",
                gap: "2px"
              }}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isPositive ? `+${changePercent}%` : `${changePercent}%`} ({timeframe})
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#8b949e", marginTop: "2px" }}>
              {activeDataPoint.dateLabel}
            </div>
          </div>

          {/* Timeframe selector buttons */}
          {showControls && (
            <div style={{ display: "flex", gap: "4px", background: "#161b22", padding: "2px", borderRadius: "6px", border: "1px solid #30363d" }}>
              {["1H", "24H", "7D", "ALL"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    background: timeframe === tf ? "#21262d" : "transparent",
                    color: timeframe === tf ? "#58a6ff" : "#8b949e",
                    border: "none",
                    borderRadius: "4px",
                    padding: "3px 7px",
                    fontSize: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SVG Interactive Canvas */}
      <div 
        style={{ position: "relative", width: "100%", height: `${svgHeight}px`, overflow: "hidden" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const relativeX = Math.max(0, Math.min(1, (mouseX - paddingX) / (rect.width - paddingX * 2)));
          const index = Math.round(relativeX * (chartData.length - 1));
          setHoverPoint(index);
        }}
        onMouseLeave={() => setHoverPoint(null)}
      >
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            {/* Cyan / Blue Gradient for Area */}
            <linearGradient id={`grad-yes-${marketId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#58a6ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing Stroke Filter */}
            <filter id={`glow-${marketId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines (25%, 50%, 75%) */}
          <line x1={paddingX} y1={svgHeight * 0.25} x2={svgWidth - paddingX} y2={svgHeight * 0.25} stroke="#21262d" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={paddingX} y1={svgHeight * 0.50} x2={svgWidth - paddingX} y2={svgHeight * 0.50} stroke="#30363d" strokeDasharray="2 2" strokeWidth="1" />
          <line x1={paddingX} y1={svgHeight * 0.75} x2={svgWidth - paddingX} y2={svgHeight * 0.75} stroke="#21262d" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#grad-yes-${marketId})`} />

          {/* Glowing Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="#58a6ff" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter={`url(#glow-${marketId})`}
          />

          {/* Crosshair & Active Point */}
          {activeCoord && (
            <>
              {/* Vertical Crosshair Line */}
              <line 
                x1={activeCoord.x} 
                y1={0} 
                x2={activeCoord.x} 
                y2={svgHeight} 
                stroke="rgba(88, 166, 255, 0.4)" 
                strokeDasharray="2 2" 
                strokeWidth="1"
              />

              {/* Glowing Indicator Dot */}
              <circle 
                cx={activeCoord.x} 
                cy={activeCoord.y} 
                r="4.5" 
                fill="#58a6ff" 
                stroke="#0d1117" 
                strokeWidth="2" 
              />
            </>
          )}
        </svg>
      </div>

      {/* Footer Timestamp Axis */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "9px", color: "#8b949e" }}>
        <span>{firstPoint.label}</span>
        <span>{chartData[Math.floor(chartData.length / 2)].label}</span>
        <span>{lastPoint.label} (Now)</span>
      </div>
    </div>
  );
}
