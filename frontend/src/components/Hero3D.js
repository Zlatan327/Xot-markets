"use client";
import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, TrendingUp, ShieldCheck, Zap, Cpu, Activity, DollarSign, Layers } from "lucide-react";

export default function Hero3D({ totalTvl = 290350, activeAgentsCount = 8, markets = [], onExploreClick, onOpenPortfolio }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Mouse Parallax Effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // 3D Interactive WebGL/Canvas Particle Energy Rings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth * 2);
    let height = (canvas.height = canvas.offsetHeight * 2);

    let angle = 0;
    const numParticles = 60;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        radius: 120 + Math.random() * 180,
        speed: 0.008 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 2.5,
        color: i % 2 === 0 ? "#00F0FF" : "#3B82F6"
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      angle += 0.01;

      // Draw Orbit Rings in 3D Perspective
      for (let r = 140; r <= 280; r += 70) {
        ctx.beginPath();
        ctx.ellipse(
          centerX + mousePos.x * 40,
          centerY + mousePos.y * 30,
          r * 1.6,
          r * 0.55,
          angle * 0.3 + (r * 0.002),
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = r === 210 ? "rgba(0, 240, 255, 0.22)" : "rgba(59, 130, 246, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw 3D Orbiting Particle Nodes
      particles.forEach((p) => {
        p.phase += p.speed;
        const x = centerX + Math.cos(p.phase) * (p.radius * 1.5) + (mousePos.x * 60);
        const y = centerY + Math.sin(p.phase) * (p.radius * 0.55) + (mousePos.y * 40);

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * 2;
      height = canvas.height = canvas.offsetHeight * 2;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePos]);

  return (
    <section
      className="hero-dashboard"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "16px",
        background: "radial-gradient(ellipse at 80% 50%, rgba(0, 240, 255, 0.08) 0%, rgba(13, 17, 23, 0.98) 70%, #0d1117 100%)",
        border: "1px solid #21262d",
        padding: "48px 36px",
        marginBottom: "24px",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        alignItems: "center",
        gap: "36px",
        minHeight: "420px"
      }}
    >
      {/* Background Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          right: "-10%",
          width: "70%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.85
        }}
      />

      {/* Left Column: Core Value Proposition */}
      <div className="hero-copy" style={{ position: "relative", zIndex: 2 }}>
        {/* Protocol Trust Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(0, 240, 255, 0.08)",
          border: "1px solid rgba(0, 240, 255, 0.25)",
          borderRadius: "20px",
          padding: "5px 14px",
          marginBottom: "16px",
          fontSize: "12px",
          color: "var(--glow-cyan)",
          fontWeight: "600"
        }}>
          <Sparkles size={13} color="var(--glow-cyan)" />
          <span>Autonomous AI Prediction Protocol • X Layer</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: "36px",
          fontWeight: "800",
          lineHeight: "1.2",
          color: "#f0f6fc",
          letterSpacing: "-0.03em",
          margin: "0 0 14px 0"
        }}>
          Predict Autonomous <br />
          <span style={{
            background: "linear-gradient(90deg, #00F0FF 0%, #58A6FF 50%, #39D353 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            AI Agent Outcomes.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "15px",
          lineHeight: "1.5",
          color: "#8b949e",
          maxWidth: "490px",
          margin: "0 0 24px 0"
        }}>
          Trade on real-time cross-DEX arbitrage volumes, delta-neutral yield APY, and high-frequency MEV agent metrics with automated Aave V3 yield compounding on X Layer.
        </p>

        {/* Interactive CTA Action Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
          <button
            onClick={onExploreClick}
            style={{
              background: "#1f6feb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 22px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(31, 111, 235, 0.4)",
              transition: "transform 0.15s, background 0.15s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            EXPLORE MARKETS <ArrowRight size={14} />
          </button>

          <button
            onClick={onOpenPortfolio}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#f0f6fc",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "background 0.15s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
          >
            VIEW PORTFOLIO
          </button>
        </div>

        {/* Live TVL & Telemetry Badges */}
        <div className="hero-stats" style={{ display: "flex", gap: "18px", borderTop: "1px solid #21262d", paddingTop: "18px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Total Collateral</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#f0f6fc" }}>
              ${totalTvl.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", color: "#39d353" }}>USDC</span>
            </div>
          </div>

          <div style={{ width: "1px", height: "30px", background: "#21262d" }} />

          <div>
            <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Verified AI Agents</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "var(--glow-cyan)" }}>
              {activeAgentsCount} Deployed
            </div>
          </div>

          <div style={{ width: "1px", height: "30px", background: "#21262d" }} />

          <div>
            <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Global Protocol Consensus</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#39d353" }}>
              {markets?.length > 0 ? ((markets.reduce((acc, m) => acc + (m.poolYes || 0), 0) / (totalTvl || 1)) * 100).toFixed(1) + "% YES" : "Neutral"}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: 3D Floating Interactive Fintech Cards */}
      <div className="hero-cards" style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        perspective: "1000px"
      }}>
        {/* Floating Card 1: Top Arbitrage Agent Node (DYNAMIC) */}
        {(() => {
          const topMarket = markets?.length > 0 ? [...markets].sort((a,b) => (b.poolYes+b.poolNo)-(a.poolYes+a.poolNo))[0] : null;
          const topYesProb = topMarket && (topMarket.poolYes+topMarket.poolNo) > 0 ? Math.round((topMarket.poolYes / (topMarket.poolYes+topMarket.poolNo)) * 100) : 50;
          return (
            <div style={{
              background: "rgba(22, 27, 34, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid #30363d",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
              transform: `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) translateZ(20px)`,
              transition: "transform 0.15s ease-out",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#1f6feb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#f0f6fc" }}>{topMarket ? topMarket.agentName : "Syncing live markets..."}</div>
                  <div style={{ fontSize: "11px", color: "#8b949e" }}>Top Active Prediction Market</div>
                </div>
              </div>
              {topMarket && (
                <span style={{ background: "rgba(57, 211, 83, 0.15)", color: "#39d353", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                  {topYesProb}% YES ({topYesProb}¢)
                </span>
              )}
            </div>
          );
        })()}

        {/* Floating Card 2: Aave Yield Harvest Node */}
        <div style={{
          background: "rgba(13, 17, 23, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 20px 45px rgba(0, 240, 255, 0.12)",
          transform: `rotateY(${mousePos.x * 16}deg) rotateX(${-mousePos.y * 16}deg) translateZ(40px)`,
          transition: "transform 0.15s ease-out",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0, 240, 255, 0.15)", border: "1px solid rgba(0, 240, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} color="var(--glow-cyan)" />
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#f0f6fc" }}>Aave V3 Prize Compounding</div>
              <div style={{ fontSize: "11px", color: "#8b949e" }}>Auto-routing idle collateral to X Layer money markets</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "#39d353" }}>Active</div>
            <div style={{ fontSize: "10px", color: "#8b949e" }}>Integration</div>
          </div>
        </div>

        {/* Floating Card 3: Optimistic Oracle Verification */}
        <div style={{
          background: "rgba(22, 27, 34, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
          transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg) translateZ(10px)`,
          transition: "transform 0.15s ease-out",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(57, 211, 83, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="#39d353" />
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#f0f6fc" }}>Decentralized Oracle Settlement</div>
              <div style={{ fontSize: "11px", color: "#8b949e" }}>Chainlink & OKX DEX verifiable metrics</div>
            </div>
          </div>
          <span style={{ color: "#39d353", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#39d353" }} />
            100% On-Chain
          </span>
        </div>
      </div>
    </section>
  );
}
