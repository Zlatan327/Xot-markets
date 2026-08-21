"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../lib/contracts";
import { useToast } from "./Toast";
import { Droplet, Loader2, Fuel, ExternalLink, CheckCircle } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function FaucetButton({ signerAddress, onBalanceRefresh }) {
  const [minting, setMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { signer, isConnected, connectWallet, isCorrectNetwork, address, sendWalletTransaction } = useWeb3();
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
      // 1. Instant Gasless Claim via Relayer API
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: targetAddress })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        updateToast(toastId, {
          type: "success",
          title: "1,000 USDC Claimed!",
          message: data.okbStipendSent 
            ? "1,000 USDC + 0.005 OKB Gas Stipend delivered!" 
            : "1,000 USDC delivered to your wallet.",
          txHash: data.txHash,
          duration: 5000
        });
        if (onBalanceRefresh) onBalanceRefresh();
        setMinting(false);
        return;
      }

      // 2. Fallback to direct on-chain mint via user's connected wallet
      if (signer && isCorrectNetwork) {
        const { usdc } = await getContracts(signer);
        const mintAmount = ethers.parseUnits("1000", 18);

        const tx = await sendWalletTransaction({
          to: await usdc.getAddress(),
          data: usdc.interface.encodeFunctionData("mint", [targetAddress, mintAmount]),
          gasLimit: 120000,
        });

        updateToast(toastId, {
          type: "loading",
          title: "USDC Mint Submitted",
          message: "Waiting for X Layer confirmation...",
          txHash: tx.hash,
          duration: 0,
        });

        await tx.wait();

        updateToast(toastId, {
          type: "success",
          title: "1,000 USDC Minted!",
          message: "Balance updated successfully!",
          txHash: tx.hash,
          duration: 5000
        });
        if (onBalanceRefresh) onBalanceRefresh();
      } else {
        throw new Error(data.error || "Faucet claim failed");
      }
    } catch (e) {
      console.error("Faucet error:", e);
      let errorMsg = e.reason || e.message || "Failed to claim testnet tokens.";
      if (errorMsg.includes("insufficient funds") || errorMsg.includes("gas")) {
        errorMsg = "Your wallet needs Testnet OKB. Click 'Gas Help' in the faucet modal.";
      }
      updateToast(toastId, {
        type: "error",
        title: "Faucet Notice",
        message: errorMsg
      });
    }
    setMinting(false);
  };

  return (
    <>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        {/* Compact +1,000 Faucet Button */}
        <button
          onClick={handleClaim}
          disabled={minting}
          title="Claim 1,000 Free Testnet USDC"
          style={{
            background: "rgba(57, 211, 83, 0.12)",
            border: "1px solid rgba(57, 211, 83, 0.35)",
            color: "#39d353",
            borderRadius: "16px",
            padding: "3px 8px",
            fontSize: "11px",
            fontWeight: "700",
            cursor: minting ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            transition: "all 0.15s ease"
          }}
          onMouseOver={(e) => {
            if (!minting) e.currentTarget.style.background = "rgba(57, 211, 83, 0.22)";
          }}
          onMouseOut={(e) => {
            if (!minting) e.currentTarget.style.background = "rgba(57, 211, 83, 0.12)";
          }}
        >
          {minting ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Droplet size={11} />
          )}
          <span>+ $1K</span>
        </button>

        {/* Minimal Gas Info Button */}
        <button
          onClick={() => setShowModal(true)}
          title="Faucet & Gas Information"
          style={{
            background: "transparent",
            border: "none",
            color: "#8b949e",
            cursor: "pointer",
            padding: "2px",
            display: "inline-flex",
            alignItems: "center"
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#38bdf8"}
          onMouseOut={(e) => e.currentTarget.style.color = "#8b949e"}
        >
          <Fuel size={12} />
        </button>
      </div>

      {/* Clean Faucets Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "440px",
            width: "100%",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            color: "#f0f6fc"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Fuel size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                  X Layer Testnet Tokens & Gas
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#8b949e", lineHeight: "1.5", marginBottom: "18px" }}>
              You need <strong>USDC</strong> (for betting) and a fraction of testnet <strong>OKB</strong> (for gas).
            </p>

            {/* Claim Gasless USDC */}
            <div style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <strong style={{ fontSize: "13px", color: "#39d353" }}>1-Click USDC Faucet</strong>
                <span style={{ fontSize: "10px", color: "#8b949e" }}>Sponsored</span>
              </div>
              <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 10px 0" }}>
                Instantly claims 1,000 Testnet USDC directly to your connected wallet.
              </p>
              <button
                onClick={() => { setShowModal(false); handleClaim(); }}
                disabled={minting}
                style={{
                  width: "100%",
                  background: "#238636",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Claim 1,000 USDC Now
              </button>
            </div>

            {/* Official OKX OKB Faucet */}
            <div style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "14px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <strong style={{ fontSize: "13px", color: "#38bdf8" }}>Official OKX OKB Gas Faucet</strong>
                <span style={{ fontSize: "10px", color: "#8b949e" }}>External</span>
              </div>
              <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 10px 0" }}>
                Need OKB testnet gas? Claim directly from the official OKX Developer Faucet.
              </p>
              <a
                href="https://www.okx.com/xlayer/faucet"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  background: "#21262d",
                  color: "#58a6ff",
                  border: "1px solid #30363d",
                  borderRadius: "6px",
                  padding: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                <span>Open OKX Gas Faucet</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
