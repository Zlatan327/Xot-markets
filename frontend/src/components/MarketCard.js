"use client";
import { useState, useEffect } from 'react';
import { Clock, Activity, CheckCircle2, Info, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { getProvider, getContracts } from '../lib/contracts';
import { ethers } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';

export default function MarketCard({ market, signerAddress }) {
  const [approving, setApproving] = useState(false);
  const [buyingYes, setBuyingYes] = useState(false);
  const [buyingNo, setBuyingNo] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [betAmount, setBetAmount] = useState("10");
  const [showRules, setShowRules] = useState(false);
  const [selectedSide, setSelectedSide] = useState("YES");
  const [eligibility, setEligibility] = useState({ hasClaimed: false, canClaim: false, shares: 0 });
  const { walletProvider } = useAppKitProvider('eip155');
  
  const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
  const yesPercent = totalPool === 0 ? 50 : Math.round((market.poolYes / totalPool) * 100);
  const noPercent = totalPool === 0 ? 50 : 100 - yesPercent;

  // Potential return calculation (Pari-mutuel estimate)
  const numBet = parseFloat(betAmount) || 0;
  const estYesPayout = numBet > 0 
    ? (numBet + (market.poolNo || 0) * (numBet / ((market.poolYes || 0) + numBet || 1))).toFixed(2)
    : "0.00";
  const estNoPayout = numBet > 0
    ? (numBet + (market.poolYes || 0) * (numBet / ((market.poolNo || 0) + numBet || 1))).toFixed(2)
    : "0.00";

  useEffect(() => {
    const checkEligibility = async () => {
      if (!signerAddress || market.outcome === 0) return;
      try {
        const provider = getProvider(walletProvider);
        const { marketAbi } = await getContracts(provider);
        const marketContract = new ethers.Contract(market.marketAddress, marketAbi, provider);
        
        const claimed = await marketContract.hasClaimed(signerAddress);
        let userShares = 0n;
        
        if (market.outcome === 1) userShares = await marketContract.yesShares(signerAddress);
        else if (market.outcome === 2) userShares = await marketContract.noShares(signerAddress);
        else if (market.outcome === 3) userShares = (await marketContract.yesShares(signerAddress)) + (await marketContract.noShares(signerAddress));
        
        setEligibility({ 
          hasClaimed: claimed, 
          canClaim: userShares > 0n,
          shares: Number(ethers.formatEther(userShares))
        });
      } catch(e) {
        console.error(e);
      }
    };
    checkEligibility();
  }, [signerAddress, market.outcome, market.marketAddress, walletProvider]);

  const approveUSDC = async () => {
    if (!signerAddress) return alert("Please connect your wallet first");
    setApproving(true);
    try {
      const provider = getProvider(walletProvider);
      const signer = await provider.getSigner();
      const { usdc } = await getContracts(signer);
      
      const amount = ethers.parseUnits(betAmount.toString() || "0", 6);
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      const tx = await usdc.approve(market.marketAddress, amount);
      await tx.wait();
      alert("USDC Approved successfully! You can now place your prediction.");
    } catch (e) {
      console.error(e);
      alert("Approval failed: " + (e.reason || e.message));
    }
    setApproving(false);
  };

  const buyShares = async (isYes) => {
    if (!signerAddress) return alert("Please connect your wallet first");
    isYes ? setBuyingYes(true) : setBuyingNo(true);
    try {
      const provider = getProvider(walletProvider);
      const signer = await provider.getSigner();
      const { marketAbi } = await getContracts(signer);
      
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      const amount = ethers.parseUnits(betAmount.toString() || "0", 6);
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      const tx = await marketContract.buyShares(isYes, amount);
      await tx.wait();
      
      alert(`Successfully placed prediction on ${isYes ? 'YES' : 'NO'}!`);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Trade failed: " + (e.reason || e.message));
    }
    isYes ? setBuyingYes(false) : setBuyingNo(false);
  };

  const claimWinnings = async () => {
    if (!signerAddress) return alert("Please connect your wallet first");
    setClaiming(true);
    try {
      const provider = getProvider(walletProvider);
      const signer = await provider.getSigner();
      const { marketAbi } = await getContracts(signer);
      
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      
      const tx = await marketContract.claim();
      await tx.wait();
      
      alert("Winnings claimed and transferred to your wallet!");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Claim failed: " + (e.reason || e.message));
    }
    setClaiming(false);
  };

  const agent = market.agentDetails || {};
  const explorerUrl = `https://www.okx.com/explorer/xlayer-test/address/${market.marketAddress}`;
  const agentExplorerUrl = `https://www.okx.com/explorer/xlayer-test/address/${market.targetAgent}`;

  return (
    <div className="infra-node" style={{ borderColor: market.outcome !== 0 ? 'rgba(255,255,255,0.08)' : 'var(--border-subtle)' }}>
      {/* Header: Agent Identity & Badges */}
      <div className="node-header" style={{ alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem', width: '100%' }}>
          {/* Agent Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${market.targetAgent}&backgroundColor=050505`} 
              alt={agent.name || "Agent"} 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#0d0d0d'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: market.outcome === 0 ? 'var(--glow-green)' : '#666',
              border: '2px solid #050505'
            }} />
          </div>

          {/* Agent Name, Category & Status */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span className="font-bold text-main text-sm" style={{ letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                {agent.name || market.agentName}
              </span>
              <span style={{ 
                color: agent.badgeColor || 'var(--glow-cyan)', 
                fontSize: '0.65rem', 
                fontWeight: 600,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                padding: '1px 6px',
                borderRadius: '3px',
                textTransform: 'uppercase'
              }}>
                {agent.category || "AI Agent"}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--glow-cyan)' }} title="Verified On-Chain Agent">
                <CheckCircle2 size={13} />
              </span>
            </div>

            {/* Creator / Strategy tagline */}
            <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
              {agent.tagline || agent.strategy || "Verified Autonomous Smart Contract Agent"}
            </p>
          </div>
        </div>

        {/* Live / Ended Status Badge */}
        <div className={`tech-tag ${market.outcome !== 0 ? 'ended' : ''}`} style={{ flexShrink: 0 }}>
          <Clock size={11} /> {market.expiresIn}
        </div>
      </div>

      {/* Proposition Question & Description */}
      <div className="node-body">
        <h3 className="font-bold text-main" style={{ fontSize: '1.05rem', lineHeight: '1.35', marginBottom: '0.6rem' }}>
          {agent.question || `Will agent hit ${market.metric}?`}
        </h3>

        <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1.25rem' }}>
          {agent.description || "Settles automatically on X Layer via decentralized metric verifier contracts."}
        </p>

        {/* Odds Bars (Polymarket Style) */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ color: 'var(--glow-blue)', fontWeight: 700, fontSize: '1.1rem' }}>YES {yesPercent}%</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(${ (yesPercent / 100).toFixed(2) })</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ color: '#888', fontWeight: 700, fontSize: '1.1rem' }}>NO {noPercent}%</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(${ (noPercent / 100).toFixed(2) })</span>
            </div>
          </div>

          <div className="bar-container" style={{ height: '6px', borderRadius: '3px' }}>
            <div className="bar-yes" style={{ width: `${yesPercent}%`, background: 'var(--glow-blue)' }}></div>
            <div className="bar-no" style={{ width: `${noPercent}%`, background: 'rgba(255,255,255,0.2)' }}></div>
          </div>
        </div>

        {/* Collapsible Resolution Mechanics */}
        <div style={{ marginBottom: '0.75rem' }}>
          <button 
            onClick={() => setShowRules(!showRules)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '0.75rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem', 
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Info size={12} color="var(--glow-cyan)" />
            <span>Resolution Rules & Oracles</span>
            {showRules ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          
          {showRules && (
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '0.75rem', 
              background: 'rgba(0,0,0,0.5)', 
              borderRadius: '4px', 
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: '1.4'
            }}>
              <p style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Settlement Criteria: </strong> 
                {agent.resolutionDetails || `Resolves YES if on-chain performance satisfies ${market.metric}.`}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a href={agentExplorerUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--glow-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  Target Agent Contract <ExternalLink size={10} />
                </a>
                <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--glow-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  Market Contract <ExternalLink size={10} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: TVL + Interactive Bet Engine */}
      <div className="node-footer" style={{ flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <span className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.7rem' }}>TOTAL LIQUIDITY</span>
            <div className="data-value" style={{ fontSize: '0.95rem', fontWeight: 600 }}>${totalPool.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</div>
          </div>
          <div>
            <span className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.7rem' }}>SETTLEMENT</span>
            <div className="data-value" style={{ fontSize: '0.95rem', color: 'var(--glow-green)' }}>Aave Yield Vault</div>
          </div>
        </div>

        {market.outcome === 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Quick Amount Selector & Custom Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="terminal-input" style={{ flex: 1, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--glow-cyan)' }}>$</span>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-transparent outline-none ml-2 text-white font-mono"
                  style={{ width: '60px' }}
                  placeholder="10"
                />
                <span className="text-muted ml-auto" style={{ fontSize: '0.75rem' }}>USDC</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {["5", "25", "100"].map((amt) => (
                  <button 
                    key={amt}
                    type="button"
                    onClick={() => setBetAmount(amt)}
                    style={{
                      background: betAmount === amt ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '3px',
                      color: 'var(--text-main)',
                      padding: '2px 7px',
                      fontSize: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Est. Return if YES: <strong style={{ color: 'var(--glow-green)' }}>${estYesPayout}</strong></span>
              <span>Est. Return if NO: <strong style={{ color: 'var(--glow-green)' }}>${estNoPayout}</strong></span>
            </div>

            {/* Action Buttons: 1. Approve | 2. Buy YES | 2. Buy NO */}
            <div style={{ display: 'flex', gap: '0.4rem', width: '100%', marginTop: '0.25rem' }}>
              <button 
                className="btn-outline" 
                style={{ flex: '1', padding: '0.5rem 0.4rem', fontSize: '0.75rem' }} 
                onClick={approveUSDC} 
                disabled={approving}
                title="Approve contract to use USDC collateral"
              >
                {approving ? 'APPROVING...' : '1. APPROVE'}
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: '1.2', background: 'var(--glow-blue)', color: '#fff', padding: '0.5rem 0.4rem', fontSize: '0.75rem' }} 
                onClick={() => buyShares(true)} 
                disabled={buyingYes}
              >
                {buyingYes ? 'BUYING...' : '2. BUY YES'}
              </button>
              <button 
                className="btn-outline" 
                style={{ flex: '1.2', padding: '0.5rem 0.4rem', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.2)' }} 
                onClick={() => buyShares(false)} 
                disabled={buyingNo}
              >
                {buyingNo ? 'BUYING...' : '2. BUY NO'}
              </button>
            </div>
          </div>
        ) : (
          /* Market Resolved Outcome Banner & Claiming */
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="tech-tag" style={{ background: market.outcome === 1 ? 'rgba(0,112,243,0.2)' : 'rgba(255,255,255,0.05)' }}>
                {market.outcome === 1 ? "✓ YES RESOLVED" : market.outcome === 2 ? "✓ NO RESOLVED" : "VOIDED"}
              </span>
              {eligibility.shares > 0 && (
                <span className="font-mono text-sm" style={{ color: 'var(--glow-green)' }}>
                  You hold: {eligibility.shares.toFixed(2)} shares
                </span>
              )}
            </div>

            {eligibility.canClaim ? (
              <button 
                className="btn-primary" 
                onClick={claimWinnings} 
                disabled={claiming || eligibility.hasClaimed}
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              >
                {eligibility.hasClaimed ? 'CLAIMED' : (claiming ? 'CLAIMING...' : 'CLAIM WINNINGS')}
              </button>
            ) : (
              <span className="tech-tag ended">NO WINNING SHARES</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
