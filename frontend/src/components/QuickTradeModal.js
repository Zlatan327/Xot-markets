"use client";
import { useState, useEffect } from 'react';
import { X, CheckCircle2, Info, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { getContracts } from '../lib/contracts';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

export default function QuickTradeModal({ market, onClose, signerAddress, usdcBalance }) {
  const [betAmount, setBetAmount] = useState("10");
  const [selectedSide, setSelectedSide] = useState(true); // true = YES, false = NO
  const [approving, setApproving] = useState(false);
  const [trading, setTrading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [eligibility, setEligibility] = useState({ hasClaimed: false, canClaim: false, shares: 0 });
  const { signer, isConnected, connectWallet, isCorrectNetwork, switchToXLayer } = useWeb3();

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
        alert("Please switch network to X Layer Testnet (Chain ID 195) in your wallet.");
        return false;
      }
    }
    return true;
  };

  const approveUSDC = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    setApproving(true);
    try {
      const { usdc } = await getContracts(signer);
      const amount = ethers.parseUnits(betAmount.toString() || "0", 18);
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      const tx = await usdc.approve(market.marketAddress, amount);
      await tx.wait();
      alert("USDC Approved successfully! Now click Execute Trade.");
    } catch (e) {
      console.error(e);
      alert("Approval failed: " + (e.reason || e.message));
    }
    setApproving(false);
  };

  const buyShares = async () => {
    const ready = await ensureWalletReady();
    if (!ready || !signer) return;

    setTrading(true);
    try {
      const { marketAbi } = await getContracts(signer);
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      const amount = ethers.parseUnits(betAmount.toString() || "0", 18);
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      const tx = await marketContract.buyShares(selectedSide, amount);
      await tx.wait();
      
      alert(`Trade confirmed on X Layer! You purchased ${selectedSide ? 'YES' : 'NO'} shares.`);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Trade failed: " + (e.reason || e.message));
    }
    setTrading(false);
  };

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
    }}>
      <div style={{
        background: '#0d0d0d',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${market.targetAgent}&backgroundColor=050505`}
              alt={agent.name}
              style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="font-bold text-main" style={{ fontSize: '1rem' }}>{agent.name || market.agentName}</span>
                <CheckCircle2 size={14} color="var(--glow-cyan)" />
              </div>
              <span style={{ color: agent.badgeColor || 'var(--glow-cyan)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {agent.category || "AI Agent"}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Question */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PREDICTION MARKET</span>
            <h3 className="font-bold text-main" style={{ fontSize: '1.1rem', marginTop: '0.25rem', lineHeight: '1.3' }}>
              {agent.question || `Will agent hit ${market.metric}?`}
            </h3>
          </div>

          {/* Outcome Choice (YES / NO Toggle) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => setSelectedSide(true)}
              style={{
                background: selectedSide ? 'rgba(0, 112, 243, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: '2px solid',
                borderColor: selectedSide ? 'var(--glow-blue)' : 'var(--border-subtle)',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--glow-blue)' }}>BUY YES</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{yesPercent}%</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Odds: ${(yesPercent / 100).toFixed(2)}</span>
            </button>

            <button
              onClick={() => setSelectedSide(false)}
              style={{
                background: !selectedSide ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: '2px solid',
                borderColor: !selectedSide ? 'var(--text-main)' : 'var(--border-subtle)',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#aaa' }}>BUY NO</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{noPercent}%</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Odds: ${(noPercent / 100).toFixed(2)}</span>
            </button>
          </div>

          {/* Amount Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>ORDER AMOUNT</span>
              <span>Balance: ${usdcBalance || "0.00"} USDC</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div className="terminal-input" style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--glow-cyan)' }}>$</span>
                <input 
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-transparent outline-none ml-2 text-white font-mono"
                  style={{ width: '100%', fontSize: '1rem' }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>USDC</span>
              </div>

              {["10", "50", "100", "500"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  style={{
                    background: betAmount === amt ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    padding: '0 12px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Payout</span>
              <span className="font-mono" style={{ fontWeight: 600 }}>${estPayout} USDC</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Potential Profit</span>
              <span className="font-mono" style={{ color: 'var(--glow-green)', fontWeight: 600 }}>+${potentialProfit} ({returnPercentage}%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Settlement Protocol</span>
              <span style={{ color: 'var(--glow-cyan)' }}>Aave Interest Bearing Pool</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              className="btn-outline" 
              onClick={approveUSDC} 
              disabled={approving}
              style={{ flex: 1, padding: '0.75rem' }}
            >
              {approving ? 'APPROVING...' : '1. APPROVE USDC'}
            </button>
            <button 
              className="btn-primary" 
              onClick={buyShares} 
              disabled={trading}
              style={{ flex: 1.5, padding: '0.75rem', background: selectedSide ? 'var(--glow-blue)' : '#ffffff', color: selectedSide ? '#fff' : '#000' }}
            >
              {trading ? 'CONFIRMING...' : `2. BUY ${selectedSide ? 'YES' : 'NO'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
