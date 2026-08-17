"use client";
import React from "react";
import { CheckCircle2, Clock, ShieldAlert, Award, ArrowRight, Activity } from "lucide-react";

export default function ResolutionStepper({ outcome = 0, expiresIn = "Live" }) {
  // Outcomes: 0 = PENDING (Live), 1 = YES WON, 2 = NO WON, 3 = VOID
  const isLive = outcome === 0 && expiresIn === "Live";
  const isExpiredPending = outcome === 0 && expiresIn !== "Live";
  const isAutoResolved = outcome !== 0; // Finalized

  const steps = [
    {
      id: 1,
      name: "1. Trading Active",
      desc: "Open orderflow on X Layer",
      status: isLive ? "CURRENT" : "COMPLETED",
      icon: Activity
    },
    {
      id: 2,
      name: "2. Expiry Snapshot",
      desc: "Trading cutoff block reached",
      status: isLive ? "UPCOMING" : isExpiredPending ? "CURRENT" : "COMPLETED",
      icon: Clock
    },
    {
      id: 3,
      name: "3. Auto-Resolution & Challenge",
      desc: "Resolver queries oracle (4H Window)",
      status: isLive ? "UPCOMING" : isExpiredPending ? "UPCOMING" : "COMPLETED",
      icon: ShieldAlert
    },
    {
      id: 4,
      name: "4. Finalized & Claimable",
      desc: "Payouts distributed to winners",
      status: outcome !== 0 ? "COMPLETED" : "UPCOMING",
      icon: Award
    }
  ];

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "8px",
      padding: "14px",
      marginTop: "12px",
      fontSize: "12px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Optimistic Oracle Resolution Pipeline
        </span>
        <span style={{
          fontSize: "10px",
          padding: "2px 8px",
          borderRadius: "10px",
          background: outcome === 0 ? "rgba(88, 166, 255, 0.15)" : "rgba(57, 211, 83, 0.15)",
          color: outcome === 0 ? "#58a6ff" : "#39d353",
          fontWeight: "700",
          border: outcome === 0 ? "1px solid rgba(88, 166, 255, 0.3)" : "1px solid rgba(57, 211, 83, 0.3)"
        }}>
          {outcome === 0 ? "PHASE 1: LIVE BIDDING" : "PHASE 4: SETTLED"}
        </span>
      </div>

      {/* 4-Step Pipeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {steps.map((step, idx) => {
          const isDone = step.status === "COMPLETED";
          const isCurrent = step.status === "CURRENT";
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "6px",
                background: isCurrent 
                  ? "rgba(88, 166, 255, 0.08)" 
                  : isDone 
                    ? "rgba(57, 211, 83, 0.06)" 
                    : "rgba(255, 255, 255, 0.02)",
                border: isCurrent 
                  ? "1px solid rgba(88, 166, 255, 0.3)" 
                  : isDone 
                    ? "1px solid rgba(57, 211, 83, 0.2)" 
                    : "1px solid #21262d"
              }}
            >
              {/* Step Circle Indicator */}
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isCurrent ? "#58a6ff" : isDone ? "#238636" : "#21262d",
                color: isCurrent || isDone ? "#fff" : "#8b949e",
                fontSize: "11px",
                fontWeight: "700",
                flexShrink: 0
              }}>
                {isDone ? <CheckCircle2 size={14} color="#fff" /> : <StepIcon size={12} />}
              </div>

              {/* Step Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: isCurrent ? "700" : "600",
                  color: isCurrent ? "#58a6ff" : isDone ? "#f0f6fc" : "#8b949e"
                }}>
                  {step.name}
                </div>
                <div style={{ fontSize: "10px", color: isCurrent ? "#8b949e" : "#6e7681" }}>
                  {step.desc}
                </div>
              </div>

              {/* Status Pill */}
              <div style={{
                fontSize: "9px",
                fontWeight: "700",
                padding: "2px 6px",
                borderRadius: "4px",
                background: isCurrent ? "rgba(88, 166, 255, 0.2)" : isDone ? "rgba(57, 211, 83, 0.2)" : "#161b22",
                color: isCurrent ? "#58a6ff" : isDone ? "#39d353" : "#6e7681",
                textTransform: "uppercase"
              }}>
                {step.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
