"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import addresses from "../lib/addresses.json";
import { getContracts } from "../lib/contracts";
import { useToast } from "./Toast";
import { Droplet, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function FaucetButton({ signerAddress, onBalanceRefresh }) {
  const [minting, setMinting] = useState(false);
  const { signer, isConnected, connectWallet, isCorrectNetwork, switchToXLayer, address } = useWeb3();
  const { addToast, updateToast } = useToast();

  const ensureWalletReady = async () => {
    if (!isConnected || !signer) {
      await connectWallet();
      return false;
    }
    if (!isCorrectNetwork) {
      const switched = await switchToXLayer();
      if (!switched) {
        addToast({
          type: "error",
          title: "Wrong Network",
          message: "Please switch network to X Layer Testnet (Chain ID 195) in your wallet."
        });
        return false;
      }
    }
    return true;
  };

  const claimFaucet = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) {
      if (!isConnected) {
        addToast({
          type: "info",
          title: "Connect Wallet",
          message: "Connecting to your Web3 wallet..."
        });
      }
      return;
    }

    const targetAddress = signerAddress || address;
    if (!targetAddress) return;

    setMinting(true);
    const toastId = addToast({
      type: "loading",
      title: "Minting 1,000 USDC...",
      message: "Sending faucet transaction to X Layer Testnet.",
      duration: 0
    });

    try {
      const { usdc } = await getContracts(signer);
      const mintAmount = ethers.parseUnits("1000", 18);
      const tx = await usdc.mint(targetAddress, mintAmount);
      
      updateToast(toastId, {
        type: "loading",
        title: "Transaction Submitted",
        message: "Waiting for block confirmation on X Layer...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();

      updateToast(toastId, {
        type: "success",
        title: "1,000 Testnet USDC Minted!",
        message: "Your balance has been updated. You're ready to trade!",
        txHash: tx.hash,
        duration: 6000
      });

      if (onBalanceRefresh) onBalanceRefresh();
    } catch (e) {
      console.error("Faucet mint error:", e);
      let errorMsg = e.reason || e.message || "Failed to mint testnet tokens.";
      if (errorMsg.includes("insufficient funds") || errorMsg.includes("gas")) {
        errorMsg = "Insufficient testnet OKB for gas. You need a small amount of testnet OKB to send transactions.";
      }
      updateToast(toastId, {
        type: "error",
        title: "Faucet Claim Failed",
        message: errorMsg
      });
    }
    setMinting(false);
  };

  return (
    <button
      onClick={claimFaucet}
      disabled={minting}
      title="Mint 1,000 Free Testnet USDC for Predictions"
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
        transition: "all 0.2s"
      }}
      onMouseOver={(e) => { if (!minting) e.currentTarget.style.background = "rgba(0, 240, 255, 0.16)"; }}
      onMouseOut={(e) => { if (!minting) e.currentTarget.style.background = "rgba(0, 240, 255, 0.08)"; }}
    >
      {minting ? (
        <>
          <Loader2 size={13} className="animate-spin" />
          <span>MINTING...</span>
        </>
      ) : (
        <>
          <Droplet size={13} fill="var(--glow-cyan)" />
          <span>FAUCET (+1,000 USDC)</span>
        </>
      )}
    </button>
  );
}
