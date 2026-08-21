"use client";
import React, { useState } from "react";
import addresses from "../lib/addresses.json";
import { ExternalLink, Copy, Check, ShieldCheck, Code, ArrowUpRight } from "lucide-react";

export default function ContractsModal({ onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contracts = [
    {
      name: "Market Factory",
      address: addresses.factory,
      role: "Deploys and tracks all BinaryMarket contracts, fee recipient, and market registry.",
      tag: "Core Protocol"
    },
    {
      name: "Optimistic Resolver (Oracle)",
      address: addresses.resolver,
      role: "Settles market outcomes using on-chain registry metrics with 4-hour challenge periods.",
      tag: "Oracle & Dispute"
    },
    {
      name: "Yield Router (Aave V3)",
      address: addresses.yieldRouter,
      role: "Commands idle market collateral into Aave pools to harvest passive yield for treasury.",
      tag: "Yield Routing"
    },
    {
      name: "USDC Collateral Token",
      address: addresses.usdc,
      role: "Testnet ERC20 settlement token for trading, prize pools, and dispute bonds.",
      tag: "Collateral"
    }
  ];

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
        maxWidth: "760px",
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
                <Code size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Live Smart Contracts on X Layer</h2>
            </div>
            <p style={{ margin: "6px 0 0 0", color: "#8b949e", fontSize: "13px" }}>
              All contracts are deployed and transacting on <strong>X Layer Testnet (Chain ID 1952)</strong>.
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

        {/* Contract Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          {contracts.map((c, idx) => (
            <div key={idx} style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "10px",
              padding: "16px",
              transition: "border-color 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "#f0f6fc" }}>{c.name}</span>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid #30363d", color: "var(--glow-cyan)", fontWeight: "600" }}>
                    {c.tag}
                  </span>
                </div>
                <a
                  href={`https://www.okx.com/explorer/xlayer-test/address/${c.address}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#58a6ff", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  OKX Explorer <ExternalLink size={12} />
                </a>
              </div>

              <p style={{ margin: "0 0 10px 0", color: "#8b949e", fontSize: "12px", lineHeight: "1.4" }}>
                {c.role}
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#0d1117",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #21262d",
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#c9d1d9"
              }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "10px" }}>
                  {c.address}
                </span>
                <button
                  onClick={() => copyToClipboard(c.address, c.name)}
                  style={{
                    background: "none",
                    border: "none",
                    color: copiedKey === c.name ? "#39d353" : "#8b949e",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    flexShrink: 0
                  }}
                >
                  {copiedKey === c.name ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub & Verification Link */}
        <div style={{
          background: "rgba(0, 240, 255, 0.05)",
          border: "1px solid rgba(0, 240, 255, 0.2)",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", color: "var(--glow-cyan)" }}>Open-Source Verified Repository</div>
            <div style={{ fontSize: "12px", color: "#8b949e" }}>Full Solidity sources, unit tests, Hardhat config, and MCP Server.</div>
          </div>
          <a
            href="https://github.com/Zlatan327/Xot-markets"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "var(--glow-cyan)",
              color: "#050505",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "700",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            GitHub Repo <ArrowUpRight size={14} />
          </a>
        </div>

      </div>
    </div>
  );
}
