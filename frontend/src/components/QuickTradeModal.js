"use client";
import { useState, useEffect } from 'react';
import { X, CheckCircle2, Info, ExternalLink, ShieldCheck, Clock, Sparkles, Share2 } from 'lucide-react';
import { getContracts, getPublicProvider } from '../lib/contracts';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { useToast } from './Toast';

export default function QuickTradeModal({ market, onClose, signerAddress, usdcBalance, onTradeComplete }) {
  const [betAmount, setBetAmount] = useState("25");
  const [selectedSide, setSelectedSide] = useState(true); // true = YES, false = NO
  const [tradeMode, setTradeMode] = useState("BUY"); // "BUY" | "SELL"
  const [approving, setApproving] = useState(false);
  const [trading, setTrading] = useState(false);
  const [userHoldings, setUserHoldings] = useState({ yesShares: 0, noShares: 0 });
  const { signer, isConnected, connectWallet, isCorrectNetwork, switchToXLayer, address } = useWeb3();
  const { addToast, updateToast } = useToast();

  const activeUser = signerAddress || address;

  useEffect(() => {
    if (!activeUser || !market?.marketAddress) return;

    const fetchHoldings = async () => {
      try {
        const provider = getPublicProvider();
        const { marketAbi } = await getContracts(provider);
        const contract = new ethers.Contract(market.marketAddress, marketAbi, provider);
        const [yesBN, noBN] = await Promise.all([
          contract.yesShares(activeUser),
          contract.noShares(activeUser)
        ]);
        setUserHoldings({
          yesShares: parseFloat(ethers.formatEther(yesBN)),
          noShares: parseFloat(ethers.formatEther(noBN))
        });
      } catch (e) {
        console.error("Error reading holdings in modal:", e);
      }
    };

    fetchHoldings();
  }, [activeUser, market?.marketAddress]);

  if (!market) return null;

  const agent = market.agentDetails || {};
  const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
  const yesPercent = totalPool === 0 ? 50 : Math.round((market.poolYes / totalPool) * 100);
  const noPercent = totalPool === 0 ? 50 : 100 - yesPercent;

  const numBet = parseFloat(betAmount) || 0;
  const estPayout = numBet > 0
    ? selectedSide
      ? (numBet + (market.poolNo || 0) * (numBet / ((market.poolYes || 0) + numBet || 1))).toFixed(2)
      : (numBet + (market.poolYes || 0) * (numBet / ((market.poolNo || 0) + numBet || 1))).toFixed(2)
    : "0.00";
  const potentialProfit = numBet > 0 ? (parseFloat(estPayout) - numBet).toFixed(2) : "0.00";
  const returnPercentage = numBet > 0 ? ((parseFloat(potentialProfit) / numBet) * 100).toFixed(1) : "0.0";

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
        message: "Waiting for block confirmation...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();
      updateToast(toastId, {
        type: "success",
        title: "USDC Approved!",
        message: `Approved ${betAmount} USDC. Click 'Buy ${selectedSide ? "YES" : "NO"}' to trade.`,
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

  const buyShares = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    setTrading(true);
    const toastId = addToast({
      type: "loading",
      title: `Executing ${selectedSide ? 'YES' : 'NO'} Order...`,
      message: `Placing ${betAmount} USDC prediction on X Layer.`,
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
        setTrading(false);
        return;
      }
      
      const { usdc } = await getContracts(signer);
      const currentAllowance = await usdc.allowance(activeUser, market.marketAddress);
      
      if (currentAllowance < amount) {
        updateToast(toastId, {
          type: "loading",
          title: "Approving USDC",
          message: "Please sign the approval transaction in your wallet...",
          duration: 0
        });
        const approveTx = await usdc.approve(market.marketAddress, amount);
        await approveTx.wait(1); // wait for 1 confirmation
        updateToast(toastId, {
          type: "loading",
          title: "Executing Trade",
          message: "Approval complete. Please sign the buy transaction...",
          duration: 0
        });
        
        // Add a small delay to let the RPC node sync the allowance state
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Pass manual gasLimit to bypass Ethers estimateGas which fails if RPC is slightly out of sync
      const tx = await marketContract.buyShares(selectedSide, amount, { gasLimit: 500000 });
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
        title: "Prediction Placed Successfully!",
        message: `Acquired ${selectedSide ? 'YES' : 'NO'} shares! Positions updated.`,
        txHash: tx.hash,
        duration: 6000
      });

      // Update local holdings immediately
      setUserHoldings(prev => ({
        yesShares: selectedSide ? prev.yesShares + parseFloat(betAmount) : prev.yesShares,
        noShares: !selectedSide ? prev.noShares + parseFloat(betAmount) : prev.noShares
      }));

      if (onTradeComplete) onTradeComplete();
    } catch (e) {
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Trade Failed",
        message: e.reason || e.message || "Transaction failed."
      });
    }
    setTrading(false);
  };

  const sellShares = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    setTrading(true);
    const toastId = addToast({
      type: "loading",
      title: `Selling ${selectedSide ? 'YES' : 'NO'} Shares...`,
      message: `Executing sell order on X Layer.`,
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
          message: "Please enter a valid amount of shares to sell."
        });
        setTrading(false);
        return;
      }
      
      const tx = await marketContract.sellShares(selectedSide, amount, { gasLimit: 500000 });
      updateToast(toastId, {
        type: "loading",
        title: "Sell Order Submitted",
        message: "Confirming on X Layer Testnet...",
        txHash: tx.hash,
        duration: 0
      });

      await tx.wait();
      updateToast(toastId, {
        type: "success",
        title: "Shares Sold Successfully!",
        message: `Exited ${selectedSide ? 'YES' : 'NO'} position. USDC returned to wallet.`,
        txHash: tx.hash,
        duration: 6000
      });

      // Update local holdings immediately
      setUserHoldings(prev => ({
        yesShares: selectedSide ? Math.max(0, prev.yesShares - parseFloat(betAmount)) : prev.yesShares,
        noShares: !selectedSide ? Math.max(0, prev.noShares - parseFloat(betAmount)) : prev.noShares
      }));

      if (onTradeComplete) onTradeComplete();
    } catch (e) {
      console.error(e);
      updateToast(toastId, {
        type: "error",
        title: "Sell Failed",
        message: e.reason || e.message || "Transaction failed."
      });
    }
    setTrading(false);
  };

  const shareToTwitter = () => {
    const agentName = agent.name || market.agentName || "AI Agent";
    const text = encodeURIComponent(
      `I'm taking a position on @${agentName} on @XLayerOfficial prediction market @XotMarkets!\n\n` +
      `🎯 Question: "${agent.question || market.metric}"\n` +
      `📊 Live Odds: ${yesPercent}% YES\n` +
      `⚡ #OKXAI #XLayer #DeFi\n\n`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const hasHoldings = userHoldings.yesShares > 0 || userHoldings.noShares > 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden',
        color: '#f0f6fc'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #21262d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <img 
              src={agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${market.targetAgent}&backgroundColor=050505`}
              alt={agent.name}
              style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid #30363d' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#f0f6fc' }}>{agent.name || market.agentName}</span>
                <CheckCircle2 size={14} color="var(--glow-cyan)" />
              </div>
              <span style={{ color: agent.badgeColor || 'var(--glow-cyan)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {agent.category || "AI Agent"}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={shareToTwitter}
              title="Share on X"
              style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
            >
              <Share2 size={13} />
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Question */}
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PREDICTION MARKET</span>
            <h3 style={{ fontSize: '1.1rem', marginTop: '0.25rem', lineHeight: '1.3', fontWeight: '700', color: '#f0f6fc' }}>
              {agent.question || `Will agent hit ${market.metric}?`}
            </h3>
          </div>

          {/* Current User Holdings Banner */}
          {activeUser && (
            <div style={{
              background: hasHoldings ? 'rgba(57, 211, 83, 0.1)' : '#161b22',
              border: hasHoldings ? '1px solid rgba(57, 211, 83, 0.3)' : '1px solid #21262d',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <span style={{ color: '#8b949e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} color={hasHoldings ? '#39d353' : '#8b949e'} />
                Your Current Holdings:
              </span>
              <strong style={{ color: hasHoldings ? '#39d353' : '#c9d1d9' }}>
                {hasHoldings 
                  ? userHoldings.yesShares > 0 ? `${userHoldings.yesShares.toFixed(1)} YES` : `${userHoldings.noShares.toFixed(1)} NO`
                  : "0 Shares (No open position)"}
              </strong>
            </div>
          )}

          {/* Action Tabs: BUY / SELL */}
          {hasHoldings && (
            <div style={{ display: 'flex', gap: '4px', background: '#161b22', padding: '4px', borderRadius: '8px', border: '1px solid #30363d' }}>
              <button
                onClick={() => setTradeMode("BUY")}
                style={{
                  flex: 1,
                  background: tradeMode === "BUY" ? '#21262d' : 'transparent',
                  color: tradeMode === "BUY" ? '#f0f6fc' : '#8b949e',
                  border: 'none',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                BUY SHARES
              </button>
              <button
                onClick={() => setTradeMode("SELL")}
                style={{
                  flex: 1,
                  background: tradeMode === "SELL" ? '#21262d' : 'transparent',
                  color: tradeMode === "SELL" ? '#f0f6fc' : '#8b949e',
                  border: 'none',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                SELL SHARES
              </button>
            </div>
          )}

          {/* Outcome Choice (YES / NO Toggle) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => setSelectedSide(true)}
              style={{
                background: selectedSide ? 'rgba(88, 166, 255, 0.15)' : '#161b22',
                border: '2px solid',
                borderColor: selectedSide ? '#58a6ff' : '#30363d',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#58a6ff' }}>YES</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f0f6fc' }}>{yesPercent}%</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>Share Price: {yesPercent}¢</span>
              {tradeMode === "SELL" && <div style={{ fontSize: '0.75rem', color: '#39d353', marginTop: '4px' }}>Owned: {userHoldings.yesShares.toFixed(1)}</div>}
            </button>

            <button
              onClick={() => setSelectedSide(false)}
              style={{
                background: !selectedSide ? 'rgba(255, 255, 255, 0.1)' : '#161b22',
                border: '2px solid',
                borderColor: !selectedSide ? '#f0f6fc' : '#30363d',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#c9d1d9' }}>NO</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f0f6fc' }}>{noPercent}%</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>Share Price: {noPercent}¢</span>
              {tradeMode === "SELL" && <div style={{ fontSize: '0.75rem', color: '#39d353', marginTop: '4px' }}>Owned: {userHoldings.noShares.toFixed(1)}</div>}
            </button>
          </div>

          {/* Amount Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8b949e', marginBottom: '0.5rem' }}>
              <span>{tradeMode === "BUY" ? "ORDER AMOUNT (USDC)" : "SHARES TO SELL"}</span>
              <span>{tradeMode === "BUY" ? `USDC Balance: $${usdcBalance || "0.00"}` : `Max: ${(selectedSide ? userHoldings.yesShares : userHoldings.noShares).toFixed(1)}`}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#161b22', border: '1px solid #30363d', borderRadius: '6px' }}>
                <span style={{ color: 'var(--glow-cyan)', fontWeight: '700' }}>{tradeMode === "BUY" ? "$" : ""}</span>
                <input 
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', marginLeft: '6px', fontSize: '1rem', fontWeight: '600' }}
                  placeholder="25"
                />
                <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>{tradeMode === "BUY" ? "USDC" : "SHARES"}</span>
              </div>

              {tradeMode === "BUY" ? (
                ["10", "50", "100", "500"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetAmount(amt)}
                    style={{
                      background: betAmount === amt ? '#21262d' : '#161b22',
                      border: betAmount === amt ? '1px solid #58a6ff' : '1px solid #30363d',
                      borderRadius: '6px',
                      color: betAmount === amt ? '#58a6ff' : '#8b949e',
                      padding: '0 12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ${amt}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => setBetAmount((selectedSide ? userHoldings.yesShares : userHoldings.noShares).toString())}
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#58a6ff',
                    padding: '0 12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  MAX
                </button>
              )}
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.8rem'
          }}>
            {tradeMode === "BUY" ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Estimated Payout</span>
                  <span style={{ fontWeight: 700, color: '#39d353' }}>${estPayout} USDC</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Potential Profit</span>
                  <span style={{ color: '#39d353', fontWeight: 700 }}>+${potentialProfit} ({returnPercentage}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Early Bonus</span>
                  <span style={{ color: 'var(--glow-cyan)' }}>Up to 1.5x Multiplier</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Shares to Sell</span>
                  <span style={{ fontWeight: 700, color: '#f0f6fc' }}>{numBet} {selectedSide ? 'YES' : 'NO'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Exit Fee (Spread)</span>
                  <span style={{ color: '#f85149' }}>2.0%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Estimated Return</span>
                  <span style={{ color: '#39d353', fontWeight: 700 }}>${(numBet * (selectedSide ? (market.poolYes/totalPool || 0.5) : (market.poolNo/totalPool || 0.5)) * 0.98).toFixed(2)} USDC</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            {tradeMode === "BUY" ? (
              <button 
                onClick={buyShares} 
                disabled={trading}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  background: selectedSide ? '#1f6feb' : '#30363d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: trading ? 'not-allowed' : 'pointer'
                }}
              >
                {trading ? 'PROCESSING...' : `PLACE PREDICTION (${selectedSide ? 'YES' : 'NO'})`}
              </button>
            ) : (
              <button 
                onClick={sellShares} 
                disabled={trading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#238636',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: trading ? 'not-allowed' : 'pointer'
                }}
              >
                {trading ? 'SELLING...' : `SELL ${selectedSide ? 'YES' : 'NO'} SHARES`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
