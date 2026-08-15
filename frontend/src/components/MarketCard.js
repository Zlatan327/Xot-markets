"use client";
import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Info, ChevronDown, ChevronUp, ExternalLink, TrendingUp, TrendingDown, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { getPublicProvider, getContracts } from "../lib/contracts";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import { useToast } from "./Toast";

export default function MarketCard({ market, signerAddress, onOpenResearch }) {
  const [approving, setApproving] = useState(false);
  const [buyingYes, setBuyingYes] = useState(false);
  const [buyingNo, setBuyingNo] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [betAmount, setBetAmount] = useState("25");
  const [selectedSide, setSelectedSide] = useState("YES"); // YES or NO
  const [showRules, setShowRules] = useState(false);
  
  // User position & eligibility state
  const [userPosition, setUserPosition] = useState({
    yesShares: 0,
    noShares: 0,
    currentValue: 0,
    estPayout: 0,
    pnl: 0,
    pnlPercent: 0,
    hasClaimed: false,
    canClaim: false
  });

  const { signer, isConnected, connectWallet, isCorrectNetwork, switchToXLayer, address } = useWeb3();
  const { addToast, updateToast } = useToast();

  const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
  const yesProb = totalPool === 0 ? 0.50 : (market.poolYes / totalPool);
  const noProb = totalPool === 0 ? 0.50 : (market.poolNo / totalPool);
  
  const yesPercent = Math.round(yesProb * 100);
  const noPercent = 100 - yesPercent;
  const yesPriceCents = (yesProb * 100).toFixed(0);
  const noPriceCents = (noProb * 100).toFixed(0);

  // Live order calculations
  const numBet = parseFloat(betAmount) || 0;
  const estYesPayout = numBet > 0 
    ? (numBet + (market.poolNo || 0) * (numBet / ((market.poolYes || 0) + numBet || 1)))
    : 0;
  const estNoPayout = numBet > 0
    ? (numBet + (market.poolYes || 0) * (numBet / ((market.poolNo || 0) + numBet || 1)))
    : 0;

  const activePayout = selectedSide === "YES" ? estYesPayout : estNoPayout;
  const activeProfit = Math.max(0, activePayout - numBet);
  const activeRoi = numBet > 0 ? ((activeProfit / numBet) * 100).toFixed(1) : "0.0";
  const estSharesReceived = selectedSide === "YES"
    ? (yesProb > 0 ? (numBet / yesProb).toFixed(2) : numBet.toFixed(2))
    : (noProb > 0 ? (numBet / noProb).toFixed(2) : numBet.toFixed(2));

  // Live user position & PnL scanner
  useEffect(() => {
    const fetchPosition = async () => {
      const activeUser = signerAddress || address;
      if (!activeUser || !market.marketAddress) return;

      try {
        const provider = getPublicProvider();
        const { marketAbi } = await getContracts(provider);
        const contract = new ethers.Contract(market.marketAddress, marketAbi, provider);

        const [yesSharesBN, noSharesBN, claimed] = await Promise.all([
          contract.yesShares(activeUser),
          contract.noShares(activeUser),
          contract.hasClaimed(activeUser)
        ]);

        const yesShares = parseFloat(ethers.formatEther(yesSharesBN));
        const noShares = parseFloat(ethers.formatEther(noSharesBN));

        // Value based on live market probability
        const currentValue = (yesShares * yesProb) + (noShares * noProb);
        const costBasis = yesShares + noShares; // In pari-mutuel, 1 share initially cost 1 USDC proportional stake
        const pnl = currentValue - costBasis;
        const pnlPercent = costBasis > 0 ? ((pnl / costBasis) * 100) : 0;

        let canClaim = false;
        let estPayout = 0;

        if (market.outcome === 1 && yesShares > 0 && !claimed) {
          canClaim = true;
          estPayout = (yesShares * totalPool) / (market.poolYes || 1);
        } else if (market.outcome === 2 && noShares > 0 && !claimed) {
          canClaim = true;
          estPayout = (noShares * totalPool) / (market.poolNo || 1);
        } else if (market.outcome === 3 && !claimed) {
          canClaim = true;
          estPayout = yesShares + noShares;
        } else if (market.outcome === 0) {
          estPayout = (yesShares * (totalPool / (market.poolYes || 1))) + (noShares * (totalPool / (market.poolNo || 1)));
        }

        setUserPosition({
          yesShares,
          noShares,
          currentValue,
          estPayout,
          pnl,
          pnlPercent,
          hasClaimed: claimed,
          canClaim
        });
      } catch (e) {
        console.error("Error fetching card position:", e);
      }
    };

    fetchPosition();
  }, [signerAddress, address, market.marketAddress, market.outcome, market.poolYes, market.poolNo, totalPool, yesProb, noProb]);

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

  const approveUSDC = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    setApproving(true);
    const toastId = addToast({
      type: "loading",
      title: "Approving USDC...",
      message: "Sending approval transaction to X Layer.",
      duration: 0
    });

    try {
      const { usdc } = await getContracts(signer);
      const amount = ethers.parseUnits(betAmount.toString() || "0", 18);
      if (amount <= 0n) {
        updateToast(toastId, {
          type: "error",
          title: "Invalid Amount",
          message: "Please enter a valid bet amount."
        });
        setApproving(false);
        return;
      }
      
      const tx = await usdc.approve(market.marketAddress, amount);
      updateToast(toastId, {
        type: "loading",
        title: "Approval Submitted",
        message: "Waiting for confirmation on X Layer...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();
      updateToast(toastId, {
        type: "success",
        title: "USDC Approved!",
        message: `Approved ${betAmount} USDC. Click 'Buy ${selectedSide}' to place trade.`,
        txHash: tx.hash,
        duration: 5000
      });
    } catch (e) {
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Approval Failed",
        message: e.reason || e.message || "Failed to approve USDC."
      });
    }
    setApproving(false);
  };

  const executeTrade = async (isYes) => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    isYes ? setBuyingYes(true) : setBuyingNo(true);
    const toastId = addToast({
      type: "loading",
      title: `Placing ${isYes ? 'YES' : 'NO'} Prediction...`,
      message: `Submitting order for ${betAmount} USDC.`,
      duration: 0
    });

    try {
      const { marketAbi } = await getContracts(signer);
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      const amount = ethers.parseUnits(betAmount.toString() || "0", 18);
      if (amount <= 0n) {
        updateToast(toastId, {
          type: "error",
          title: "Invalid Amount",
          message: "Please enter a valid bet amount."
        });
        isYes ? setBuyingYes(false) : setBuyingNo(false);
        return;
      }
      
      const tx = await marketContract.buyShares(isYes, amount);
      updateToast(toastId, {
        type: "loading",
        title: "Trade Submitted",
        message: "Confirming on X Layer Testnet...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();
      updateToast(toastId, {
        type: "success",
        title: "Prediction Executed!",
        message: `Successfully acquired ${isYes ? 'YES' : 'NO'} shares!`,
        txHash: tx.hash,
        duration: 6000
      });

      // Reload state after short delay
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Trade Failed",
        message: e.reason || e.message || "Transaction failed."
      });
    }
    isYes ? setBuyingYes(false) : setBuyingNo(false);
  };

  const claimWinnings = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    setClaiming(true);
    const toastId = addToast({
      type: "loading",
      title: "Claiming Winnings...",
      message: "Sending claim transaction to X Layer.",
      duration: 0
    });

    try {
      const { marketAbi } = await getContracts(signer);
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      const tx = await marketContract.claim();

      updateToast(toastId, {
        type: "loading",
        title: "Claim Submitted",
        message: "Waiting for confirmation...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();
      updateToast(toastId, {
        type: "success",
        title: "Payout Claimed!",
        message: "Winnings transferred directly to your wallet.",
        txHash: tx.hash,
        duration: 6000
      });

      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Claim Failed",
        message: e.reason || e.message || "Failed to claim payout."
      });
    }
    setClaiming(false);
  };

  const agent = market.agentDetails || {};
  const hasUserPosition = userPosition.yesShares > 0 || userPosition.noShares > 0;

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "border-color 0.2s, box-shadow 0.2s",
      position: "relative",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
    }}>
      {/* Top Header: Agent & Category */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${market.targetAgent}&backgroundColor=050505`}
              alt={agent.name || "Agent"}
              onClick={() => onOpenResearch && onOpenResearch(market)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #30363d",
                cursor: "pointer",
                background: "#161b22"
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  onClick={() => onOpenResearch && onOpenResearch(market)}
                  style={{ fontWeight: "700", fontSize: "14px", color: "#f0f6fc", cursor: "pointer" }}
                >
                  {agent.name || market.agentName}
                </span>
                <CheckCircle2 size={13} color="var(--glow-cyan)" />
              </div>
              <span style={{ fontSize: "10px", color: agent.badgeColor || "var(--glow-cyan)", fontWeight: "600", textTransform: "uppercase" }}>
                {agent.category || "AI Agent"}
              </span>
            </div>
          </div>

          <div style={{
            fontSize: "11px",
            padding: "3px 8px",
            borderRadius: "12px",
            background: market.outcome === 0 ? "rgba(57, 211, 83, 0.1)" : "rgba(255, 255, 255, 0.05)",
            border: market.outcome === 0 ? "1px solid rgba(57, 211, 83, 0.3)" : "1px solid #30363d",
            color: market.outcome === 0 ? "#39d353" : "#8b949e",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <Clock size={11} /> {market.expiresIn}
          </div>
        </div>

        {/* Proposition Question */}
        <h3
          onClick={() => onOpenResearch && onOpenResearch(market)}
          style={{
            margin: "0 0 8px 0",
            fontSize: "15px",
            fontWeight: "600",
            lineHeight: "1.4",
            color: "#f0f6fc",
            cursor: "pointer"
          }}
        >
          {agent.question || `Will agent hit ${market.metric}?`}
        </h3>

        {/* Polymarket Live Chance & Prices Strip */}
        <div style={{
          background: "#161b22",
          borderRadius: "8px",
          border: "1px solid #21262d",
          padding: "12px",
          marginBottom: "14px"
        }}>
          {/* Chance Heading */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "22px", fontWeight: "800", color: yesPercent >= 50 ? "#58a6ff" : "#8b949e" }}>
                {yesPercent}%
              </span>
              <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: "600" }}>chance</span>
              {yesPercent >= 50 ? <TrendingUp size={16} color="#39d353" /> : <TrendingDown size={16} color="#f85149" />}
            </div>

            {/* Price Pills (¢) */}
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{
                background: "rgba(88, 166, 255, 0.12)",
                border: "1px solid rgba(88, 166, 255, 0.3)",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: "700",
                color: "#58a6ff"
              }}>
                YES {yesPriceCents}¢
              </div>
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: "700",
                color: "#8b949e"
              }}>
                NO {noPriceCents}¢
              </div>
            </div>
          </div>

          {/* Animated Odds Probability Bar */}
          <div style={{ height: "6px", width: "100%", background: "#21262d", borderRadius: "3px", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${yesPercent}%`, background: "#58a6ff", transition: "width 0.4s ease" }} />
            <div style={{ width: `${noPercent}%`, background: "rgba(255, 255, 255, 0.2)", transition: "width 0.4s ease" }} />
          </div>

          {/* Volume & Research Link */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "11px", color: "#8b949e" }}>
            <span>Liquidity: <strong style={{ color: "#f0f6fc" }}>${totalPool.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</strong></span>
            <button
              onClick={() => onOpenResearch && onOpenResearch(market)}
              style={{ background: "none", border: "none", color: "var(--glow-cyan)", cursor: "pointer", fontSize: "11px", fontWeight: "600", padding: 0 }}
            >
              🔬 Research Dossier →
            </button>
          </div>
        </div>

        {/* Live User Position Banner (if shares held) */}
        {hasUserPosition && (
          <div style={{
            background: "rgba(57, 211, 83, 0.08)",
            border: "1px solid rgba(57, 211, 83, 0.25)",
            borderRadius: "8px",
            padding: "10px 12px",
            marginBottom: "14px",
            fontSize: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "#8b949e" }}>Your Position:</span>
              <strong style={{ color: "#f0f6fc" }}>
                {userPosition.yesShares > 0 ? `${userPosition.yesShares.toFixed(1)} YES` : `${userPosition.noShares.toFixed(1)} NO`}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
              <span style={{ color: "#8b949e" }}>Est. Value: <strong style={{ color: "#39d353" }}>${userPosition.currentValue.toFixed(2)} USDC</strong></span>
              <span style={{ color: userPosition.pnl >= 0 ? "#39d353" : "#f85149", fontWeight: "700" }}>
                {userPosition.pnl >= 0 ? "+" : ""}${userPosition.pnl.toFixed(2)} ({userPosition.pnlPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trade / Resolution Action Footer */}
      <div>
        {market.outcome === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Side Selector (YES / NO Tabs) */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setSelectedSide("YES")}
                style={{
                  flex: 1,
                  background: selectedSide === "YES" ? "rgba(88, 166, 255, 0.2)" : "#161b22",
                  border: selectedSide === "YES" ? "1px solid #58a6ff" : "1px solid #30363d",
                  color: selectedSide === "YES" ? "#58a6ff" : "#8b949e",
                  padding: "8px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                YES {yesPriceCents}¢
              </button>

              <button
                type="button"
                onClick={() => setSelectedSide("NO")}
                style={{
                  flex: 1,
                  background: selectedSide === "NO" ? "rgba(255, 255, 255, 0.15)" : "#161b22",
                  border: selectedSide === "NO" ? "1px solid #f0f6fc" : "1px solid #30363d",
                  color: selectedSide === "NO" ? "#f0f6fc" : "#8b949e",
                  padding: "8px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                NO {noPriceCents}¢
              </button>
            </div>

            {/* Quick Amount Selector & Input */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "6px 10px"
              }}>
                <span style={{ color: "var(--glow-cyan)", fontSize: "12px", fontWeight: "700" }}>$</span>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  style={{ background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", marginLeft: "6px", fontSize: "13px", fontWeight: "600" }}
                  placeholder="25"
                />
                <span style={{ color: "#8b949e", fontSize: "11px" }}>USDC</span>
              </div>

              {["10", "50", "250"].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBetAmount(amt)}
                  style={{
                    background: betAmount === amt ? "#21262d" : "#161b22",
                    border: betAmount === amt ? "1px solid #58a6ff" : "1px solid #30363d",
                    color: betAmount === amt ? "#58a6ff" : "#8b949e",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Live Return / Payout Preview */}
            <div style={{ background: "#161b22", padding: "8px 10px", borderRadius: "6px", fontSize: "11px", color: "#8b949e", display: "flex", justifyContent: "space-between" }}>
              <span>Est. Payout: <strong style={{ color: "#39d353" }}>${activePayout.toFixed(2)}</strong></span>
              <span>Net Profit: <strong style={{ color: "#39d353" }}>+${activeProfit.toFixed(2)} ({activeRoi}%)</strong></span>
            </div>

            {/* Actions: Approve & Trade */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={approveUSDC}
                disabled={approving}
                style={{
                  flex: 1,
                  background: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: approving ? "not-allowed" : "pointer"
                }}
              >
                {approving ? "Approving..." : "1. Approve"}
              </button>

              <button
                onClick={() => executeTrade(selectedSide === "YES")}
                disabled={selectedSide === "YES" ? buyingYes : buyingNo}
                style={{
                  flex: 1.4,
                  background: selectedSide === "YES" ? "#1f6feb" : "#30363d",
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: (selectedSide === "YES" ? buyingYes : buyingNo) ? "not-allowed" : "pointer"
                }}
              >
                {(selectedSide === "YES" ? buyingYes : buyingNo) ? "Executing..." : `2. Buy ${selectedSide}`}
              </button>
            </div>
          </div>
        ) : (
          /* Resolved Market Actions */
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161b22", padding: "12px", borderRadius: "8px" }}>
            <div>
              <span style={{ fontSize: "10px", color: "#8b949e", textTransform: "uppercase" }}>Resolved Outcome</span>
              <div style={{ fontWeight: "700", fontSize: "14px", color: market.outcome === 1 ? "#58a6ff" : "#f0f6fc" }}>
                {market.outcome === 1 ? "✓ YES RESOLVED" : market.outcome === 2 ? "✓ NO RESOLVED" : "VOIDED"}
              </div>
            </div>

            {userPosition.canClaim ? (
              <button
                onClick={claimWinnings}
                disabled={claiming || userPosition.hasClaimed}
                style={{
                  background: "#238636",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {userPosition.hasClaimed ? "Claimed" : claiming ? "Claiming..." : `Claim $${userPosition.estPayout.toFixed(2)}`}
              </button>
            ) : (
              <span style={{ fontSize: "11px", color: "#8b949e" }}>Settled</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
