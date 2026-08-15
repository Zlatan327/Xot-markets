"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../lib/contracts";
import { useToast } from "./Toast";
import { Droplet, Loader2, Sparkles, AlertTriangle, ExternalLink, Fuel, CheckCircle } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function FaucetButton({ signerAddress, onBalanceRefresh }) {
  const [minting, setMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { signer, isConnected, connectWallet, isCorrectNetwork, switchToXLayer, address } = useWeb3();
  const { addToast, updateToast } = useToast();

  const handleClaim = async () => {
    const targetAddress = signerAddress || address;
    if (!targetAddress) {
      await connectWallet();
      return;
    }

    setMinting(true);
    const toastId = addToast({
      type: "loading",
      title: "Claiming 1,000 Testnet USDC...",
      message: "Processing gas-sponsored faucet on X Layer Testnet...",
      duration: 0
    });

    try {
      // 1. Attempt Instant Gasless Claim via Relayer API
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: targetAddress })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        updateToast(toastId, {
          type: "success",
          title: "1,000 USDC Claimed Successfully!",
          message: data.okbStipendSent 
            ? "1,000 USDC + 0.005 OKB Gas Stipend delivered to your wallet!" 
            : "1,000 USDC delivered! You're ready to place bets.",
          txHash: data.txHash,
          duration: 6000
        });
        if (onBalanceRefresh) onBalanceRefresh();
        setMinting(false);
        return;
      }

      // 2. Fallback to direct on-chain mint via user's connected wallet
      if (signer && isCorrectNetwork) {
        updateToast(toastId, {
          type: "loading",
          title: "Minting via Wallet...",
          message: "Sending on-chain transaction from your wallet...",
          duration: 0
        });

        const { usdc } = await getContracts(signer);
        const mintAmount = ethers.parseUnits("1000", 18);
        const tx = await usdc.mint(targetAddress, mintAmount);
        await tx.wait();

        updateToast(toastId, {
          type: "success",
          title: "1,000 Testnet USDC Minted!",
          message: "Balance updated successfully!",
          txHash: tx.hash,
          duration: 6000
        });
        if (onBalanceRefresh) onBalanceRefresh();
      } else {
        throw new Error(data.error || "Faucet claim failed");
      }
    } catch (e) {
      console.error("Faucet error:", e);
      let errorMsg = e.reason || e.message || "Failed to claim testnet tokens.";
      if (errorMsg.includes("insufficient funds") || errorMsg.includes("gas")) {
        errorMsg = "Your wallet needs Testnet OKB for gas. Click 'OKB Faucet' to claim free testnet OKB.";
      }
      updateToast(toastId, {
        type: "error",
        title: "Faucet Claim Notice",
        message: errorMsg
      });
    }
    setMinting(false);
  };

  return (
    <>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        {/* Main 1-Click Faucet Button */}
        <button
          onClick={handleClaim}
          disabled={minting}
          title="Claim 1,000 Free Testnet USDC"
          style={{
            background: "rgba(0, 240, 255, 0.08)",
            border: "1px solid rgba(0, 240, 255, 0.25)",
            color: "var(--glow-cyan)",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: minting ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            if (!minting) {
              e.currentTarget.style.background = "rgba(0, 240, 255, 0.15)";
              e.currentTarget.style.borderColor = "var(--glow-cyan)";
            }
          }}
          onMouseOut={(e) => {
            if (!minting) {
              e.currentTarget.style.background = "rgba(0, 240, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.25)";
            }
          }}
        >
          {minting ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Claiming...</span>
            </>
          ) : (
            <>
              <Droplet size={13} />
              <span>+1,000 USDC Faucet</span>
            </>
          )}
        </button>

        {/* OKB Gas Faucet Help Button */}
        <button
          onClick={() => setShowModal(true)}
          title="Need Testnet OKB Gas?"
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            color: "#8b949e",
            borderRadius: "6px",
            padding: "6px 8px",
            fontSize: "11px",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#f0f6fc";
            e.currentTarget.style.borderColor = "#58a6ff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#8b949e";
            e.currentTarget.style.borderColor = "#30363d";
          }}
        >
          <Fuel size={12} color="#38bdf8" />
          <span>OKB Gas</span>
        </button>
      </div>

      {/* OKB & USDC Faucets Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "460px",
            width: "100%",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Fuel size={20} color="var(--glow-cyan)" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#f0f6fc" }}>
                  X Layer Testnet Faucets
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#8b949e", lineHeight: "1.5", marginBottom: "20px" }}>
              To trade and interact on X Layer Testnet, your wallet needs <strong>USDC</strong> (for placing bets) and a tiny amount of <strong>OKB</strong> (for transaction gas).
            </p>

            {/* Option 1: Gasless USDC + OKB Stipend */}
            <div style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#f0f6fc" }}>
                  ⚡ Instant Gas-Sponsored Dispenser
                </div>
                <span style={{ fontSize: "10px", background: "rgba(57, 211, 83, 0.15)", color: "#39d353", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                  RECOMMENDED
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 12px 0" }}>
                Mints 1,000 USDC directly to your address and grants an OKB gas stipend automatically. Zero gas needed from you!
              </p>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleClaim();
                }}
                disabled={minting}
                style={{
                  width: "100%",
                  background: "#1f6feb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Claim 1,000 USDC + Gas Stipend
              </button>
            </div>

            {/* Option 2: Official OKX OKB Faucets */}
            <div style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "14px"
            }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#f0f6fc", marginBottom: "6px" }}>
                ⛽ Official OKX Testnet OKB Faucets
              </div>
              <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 12px 0" }}>
                Need more testnet OKB for advanced transactions or deploying smart contracts?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a
                  href="https://www.okx.com/xlayer/faucet"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    color: "var(--glow-cyan)",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  <span>OKX Official X Layer Faucet</span>
                  <ExternalLink size={13} />
                </a>

                <a
                  href="https://faucet.xlayer.tech/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    color: "#58a6ff",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  <span>X Layer Community Faucet</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8b949e",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
