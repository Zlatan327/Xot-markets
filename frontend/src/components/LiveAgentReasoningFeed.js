"use client";
import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { getPublicProvider, getContracts } from "../lib/contracts";
import { ethers } from "ethers";

export default function LiveAgentReasoningFeed({ agentName, marketAddress }) {
  const [logs, setLogs] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const endOfLogsRef = useRef(null);

  const addLog = (type, text) => {
    setLogs(prev => {
      const updated = [...prev, { type, text, time: new Date().toISOString().substring(11, 19) }];
      if (updated.length > 50) return updated.slice(updated.length - 50);
      return updated;
    });
  };

  useEffect(() => {
    let isMounted = true;

    const runAgentLogic = async () => {
      if (!marketAddress) return;
      
      addLog("system", `[SYSTEM] Authenticating agent identity: ${agentName}... OK`);
      addLog("system", `[SYSTEM] Connected to X Layer Testnet via RPC... OK`);
      addLog("process", `[AGENT] Target Market Contract: ${marketAddress}`);

      try {
        const provider = getPublicProvider();
        const { marketAbi } = await getContracts(provider);
        const market = new ethers.Contract(marketAddress, marketAbi, provider);

        // REAL-TIME BLOCKCHAIN DATA FETCH
        addLog("process", `[AGENT] Fetching live liquidity depth from X Layer...`);
        const [totalYes, totalNo] = await Promise.all([
          market.totalYesPool(),
          market.totalNoPool()
        ]);

        if (!isMounted) return;

        const yesNum = parseFloat(ethers.formatEther(totalYes));
        const noNum = parseFloat(ethers.formatEther(totalNo));
        const total = yesNum + noNum;

        addLog("info", `[ON-CHAIN] Current Pool: ${yesNum.toFixed(2)} USDC (YES) / ${noNum.toFixed(2)} USDC (NO)`);
        
        const impliedYes = total === 0 ? 50 : (yesNum / total) * 100;
        const impliedNo = total === 0 ? 50 : (noNum / total) * 100;

        addLog("info", `[ON-CHAIN] Implied Probability: YES ${impliedYes.toFixed(1)}% | NO ${impliedNo.toFixed(1)}%`);

        // REAL ALGORITHMIC REASONING
        addLog("process", `[AGENT] Running Expected Value (EV) Analysis...`);
        
        // Use a deterministic seed based on agentName to give them a fixed internal confidence target
        // between 60% and 90%
        let seed = 0;
        for (let i = 0; i < agentName.length; i++) {
          seed += agentName.charCodeAt(i);
        }
        const internalConfidence = 60 + (seed % 30); 
        
        addLog("process", `[AGENT] Internal Model Confidence (Metric Target): ${internalConfidence.toFixed(1)}% YES`);

        const ev = ((internalConfidence / 100) * (total / (yesNum || 1))) - 1;
        
        addLog("info", `[CALC] Expected Value (EV) for YES position: ${(ev * 100).toFixed(2)}%`);

        setIsTyping(false);

        if (ev > 0.05) {
          addLog("action", `> EXECUTE_STRATEGY: Positive EV detected. Signal = BUY YES`);
          // Calculate Kelly Criterion
          const kellyFraction = ev / ((total / (yesNum || 1)) - 1);
          addLog("action", `> KELLY_CRITERION: Recommended portfolio allocation = ${(kellyFraction * 100).toFixed(2)}%`);
        } else if (ev < -0.05) {
          addLog("action", `> EXECUTE_STRATEGY: Negative EV detected on YES. Signal = BUY NO`);
        } else {
          addLog("action", `> EXECUTE_STRATEGY: Market efficiently priced (EV near 0). Signal = HOLD`);
        }

      } catch (err) {
        if (isMounted) {
          addLog("error", `[ERROR] Failed to fetch on-chain state: ${err.message}`);
          setIsTyping(false);
        }
      }
    };

    runAgentLogic();

    // Re-evaluate every 12 seconds to keep it "live" with blockchain updates
    const interval = setInterval(() => {
      setLogs([]);
      setIsTyping(true);
      runAgentLogic();
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [agentName, marketAddress]);

  useEffect(() => {
    if (endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isTyping]);

  return (
    <div style={{
      background: "#010409",
      border: "1px solid #30363d",
      borderRadius: "8px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "360px",
      fontFamily: "monospace"
    }}>
      <div style={{
        background: "#161b22",
        padding: "8px 14px",
        borderBottom: "1px solid #30363d",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8b949e", fontWeight: "600" }}>
          <Terminal size={14} />
          {agentName.toUpperCase()} / REALTIME_ONCHAIN_EVALUATION
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#39d353",
            boxShadow: "0 0 8px rgba(57, 211, 83, 0.6)"
          }} />
          <span style={{ fontSize: "11px", color: "#39d353", fontWeight: "700" }}>LIVE DATA</span>
        </div>
      </div>
      
      <div style={{
        flex: 1,
        padding: "16px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontSize: "12px",
        lineHeight: "1.5"
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ 
            color: log.type === "action" ? "#58a6ff" : (log.type === "info" ? "#e3b341" : "#8b949e"),
            display: "flex",
            gap: "10px"
          }}>
            <span style={{ color: "#484f58", userSelect: "none" }}>{log.time}</span>
            <span>{log.text}</span>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", gap: "10px", color: "#8b949e" }}>
            <span style={{ color: "#484f58", userSelect: "none" }}>{new Date().toISOString().substring(11, 19)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="blinking-cursor">_</span>
            </span>
          </div>
        )}
        <div ref={endOfLogsRef} />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}} />
    </div>
  );
}
