"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import addresses from "../lib/addresses.json";
import { getProvider, getContracts } from "../lib/contracts";
import { useToast } from "./Toast";
import { Droplet, Loader2, Sparkles } from "lucide-react";
import { useAppKitProvider } from "@reown/appkit/react";

export default function FaucetButton({ signerAddress, onBalanceRefresh }) {
  const [minting, setMinting] = useState(false);
  const { walletProvider } = useAppKitProvider('eip155');
  const { addToast, updateToast } = useToast();

  const claimFaucet = async () => {
    if (!signerAddress) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your OKX / Web3 wallet to claim testnet USDC."
      });
      return;
    }

    setMinting(true);
    const toastId = addToast({
      type: "loading",
      title: "Minting 1,000 USDC...",
      message: "Sending faucet transaction to X Layer Testnet.",
      duration: 0
    });

    try {
      const provider = getProvider(walletProvider);
      const signer = await provider.getSigner();
      const { usdc } = await getContracts(signer);

      const mintAmount = ethers.parseUnits("1000", 18);
      const tx = await usdc.mint(signerAddress, mintAmount);
      
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
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Faucet Claim Failed",
        message: e.reason || e.message || "Failed to mint testnet tokens."
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
