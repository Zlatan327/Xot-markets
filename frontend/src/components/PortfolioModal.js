"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getPublicProvider, getContracts } from "../lib/contracts";
import { useToast } from "./Toast";
import { Briefcase, TrendingUp, Award, DollarSign, CheckCircle2, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function PortfolioModal({ markets, signerAddress, onClose, onSelectMarket, onBalanceRefresh }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingAddress, setClaimingAddress] = useState(null);
  const { signer, isConnected, connectWallet, isCorrectNetwork, switchToXLayer, sendWalletTransaction } = useWeb3();
  const { addToast, updateToast } = useToast();

  useEffect(() => {
    fetchUserPositions();
  }, [signerAddress, markets]);

  const fetchUserPositions = async () => {
    if (!signerAddress || !markets || markets.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const provider = getPublicProvider();
      const { marketAbi } = await getContracts(provider);

      const userPositions = [];

      for (const market of markets) {
        try {
          const contract = new ethers.Contract(market.marketAddress, marketAbi, provider);
          const [yesSharesBN, noSharesBN, claimed] = await Promise.all([
            contract.yesShares(signerAddress),
            contract.noShares(signerAddress),
            contract.hasClaimed(signerAddress)
          ]);

          const yesShares = parseFloat(ethers.formatEther(yesSharesBN));
          const noShares = parseFloat(ethers.formatEther(noSharesBN));

          if (yesShares > 0 || noShares > 0) {
            const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
            const yesOdds = totalPool === 0 ? 50 : Math.round((market.poolYes / totalPool) * 100);
            const noOdds = totalPool === 0 ? 50 : 100 - yesOdds;

            let claimable = 0;
            let status = "ACTIVE"; // ACTIVE, WON, LOST, VOID

            if (market.outcome === 1) { // YES WON
              if (yesShares > 0 && !claimed) {
                claimable = (yesShares * totalPool) / (market.poolYes || 1);
                status = "WON";
              } else if (noShares > 0) {
                status = "LOST";
              }
            } else if (market.outcome === 2) { // NO WON
              if (noShares > 0 && !claimed) {
                claimable = (noShares * totalPool) / (market.poolNo || 1);
                status = "WON";
              } else if (yesShares > 0) {
                status = "LOST";
              }
            } else if (market.outcome === 3) { // VOID
              if (!claimed) {
                claimable = yesShares + noShares;
                status = "VOID";
              }
            }

            userPositions.push({
              market,
              yesShares,
              noShares,
              claimed,
              claimable,
              status,
              yesOdds,
              noOdds,
              totalPool
            });
          }
        } catch (err) {
          console.error("Error reading position for market", market.marketAddress, err);
        }
      }

      setPositions(userPositions);
    } catch (e) {
      console.error("Failed to fetch user positions:", e);
    }
    setLoading(false);
  };

  const claimMarketWinnings = async (marketAddress) => {
    if (!isConnected || !signer) {
      await connectWallet();
      return;
    }
    setClaimingAddress(marketAddress);

    const toastId = addToast({
      type: "loading",
      title: "Claiming Payout...",
      message: "Sending claim transaction to X Layer Testnet.",
      duration: 0
    });

    try {
      const { marketAbi } = await getContracts(signer);
      const contract = new ethers.Contract(marketAddress, marketAbi, signer);
      const tx = await sendWalletTransaction({
        to: marketAddress,
        data: contract.interface.encodeFunctionData("claim"),
      });

      updateToast(toastId, {
        type: "loading",
        title: "Claim Submitted",
        message: "Waiting for confirmation on X Layer...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();

      updateToast(toastId, {
        type: "success",
        title: "Payout Claimed Successfully!",
        message: "Winnings transferred directly to your wallet.",
        txHash: tx.hash,
        duration: 6000
      });

      if (onBalanceRefresh) onBalanceRefresh();
      fetchUserPositions();
    } catch (e) {
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Claim Failed",
        message: e.reason || e.message || "Failed to claim payout."
      });
    }
    setClaimingAddress(null);
  };

  const totalInvested = positions.reduce((acc, p) => acc + p.yesShares + p.noShares, 0);
  const totalClaimable = positions.reduce((acc, p) => acc + (p.claimed ? 0 : p.claimable), 0);

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
        maxWidth: "880px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
        padding: "32px",
        color: "#f0f6fc",
        position: "relative",
        animation: "fadeIn 0.2s ease-out"
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ background: "rgba(0, 240, 255, 0.1)", color: "var(--glow-cyan)", padding: "6px", borderRadius: "8px" }}>
                <Briefcase size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>My Active Positions & Portfolio</h2>
            </div>
            <p style={{ margin: "6px 0 0 0", color: "#8b949e", fontSize: "13px" }}>
              Tracking all prediction stakes, current odds, and claimable payouts on X Layer.
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

        {/* Portfolio Stats Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
            <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>Total Capital Staked</div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#f0f6fc", marginTop: "4px" }}>
              ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: "12px", color: "#8b949e" }}>USDC</span>
            </div>
          </div>

          <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
            <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>Open Positions</div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--glow-cyan)", marginTop: "4px" }}>
              {positions.filter(p => p.status === "ACTIVE").length} <span style={{ fontSize: "12px", color: "#8b949e" }}>Active</span>
            </div>
          </div>

          <div style={{ background: "#161b22", padding: "16px", borderRadius: "10px", border: "1px solid #21262d" }}>
            <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", fontWeight: "600" }}>Claimable Winnings</div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#39d353", marginTop: "4px" }}>
              ${totalClaimable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: "12px", color: "#8b949e" }}>USDC</span>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--glow-cyan)" }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
            <span>Scanning your on-chain market shares...</span>
          </div>
        ) : positions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#161b22", borderRadius: "10px", border: "1px solid #21262d" }}>
            <Briefcase size={32} color="#8b949e" style={{ margin: "0 auto 10px" }} />
            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px" }}>No Open Positions Found</h4>
            <p style={{ margin: 0, color: "#8b949e", fontSize: "13px" }}>
              You haven't placed any predictions yet. Explore the market cards and trade on your favorite agents!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {positions.map((pos) => {
              const agent = pos.market.agentDetails || {};
              const isClaimable = pos.claimable > 0 && !pos.claimed;

              return (
                <div key={pos.market.marketAddress} style={{
                  background: "#161b22",
                  border: isClaimable ? "1px solid #39d353" : "1px solid #21262d",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap"
                }}>
                  {/* Agent Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "220px" }}>
                    <img
                      src={agent.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=agent"}
                      alt={agent.name}
                      style={{ width: "38px", height: "38px", borderRadius: "8px", border: "1px solid #30363d" }}
                    />
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>{agent.name || pos.market.agentName}</div>
                      <div style={{ fontSize: "11px", color: "#8b949e" }}>{agent.question}</div>
                    </div>
                  </div>

                  {/* Position Details */}
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                    {pos.yesShares > 0 && (
                      <div>
                        <span style={{ color: "#8b949e" }}>YES Stake:</span>{" "}
                        <strong style={{ color: "var(--glow-blue)" }}>{pos.yesShares.toFixed(2)} shares</strong>
                        <div style={{ fontSize: "10px", color: "#8b949e" }}>Odds: {pos.yesOdds}%</div>
                      </div>
                    )}

                    {pos.noShares > 0 && (
                      <div>
                        <span style={{ color: "#8b949e" }}>NO Stake:</span>{" "}
                        <strong style={{ color: "#888" }}>{pos.noShares.toFixed(2)} shares</strong>
                        <div style={{ fontSize: "10px", color: "#8b949e" }}>Odds: {pos.noOdds}%</div>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {isClaimable ? (
                      <button
                        onClick={() => claimMarketWinnings(pos.market.marketAddress)}
                        disabled={claimingAddress === pos.market.marketAddress}
                        style={{
                          background: "#238636",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {claimingAddress === pos.market.marketAddress ? <Loader2 size={13} className="animate-spin" /> : <Award size={14} />}
                        Claim ${pos.claimable.toFixed(2)} USDC
                      </button>
                    ) : pos.claimed ? (
                      <span style={{ fontSize: "11px", color: "#39d353", background: "rgba(57, 211, 83, 0.1)", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(57, 211, 83, 0.2)" }}>
                        ✓ Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectMarket(pos.market);
                        }}
                        style={{
                          background: "#21262d",
                          color: "var(--glow-cyan)",
                          border: "1px solid #30363d",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        Manage / Trade <ArrowUpRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
