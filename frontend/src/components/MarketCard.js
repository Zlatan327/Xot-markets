"use client";
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getProvider, getContracts } from '../lib/contracts';
import { ethers } from 'ethers';

export default function MarketCard({ market, signerAddress }) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [betAmount, setBetAmount] = useState("10");
  const [eligibility, setEligibility] = useState({ hasClaimed: false, canClaim: false });
  
  const totalPool = market.poolYes + market.poolNo;
  const yesPercent = totalPool === 0 ? 50 : Math.round((market.poolYes / totalPool) * 100);
  const noPercent = totalPool === 0 ? 50 : 100 - yesPercent;

  
  
  useEffect(() => {
    const checkEligibility = async () => {
      if (!signerAddress || market.outcome === 0) return;
      try {
        const provider = getProvider();
        const { marketAbi } = await getContracts(provider);
        const marketContract = new ethers.Contract(market.marketAddress, marketAbi, provider);
        
        const claimed = await marketContract.hasClaimed(signerAddress);
        let userShares = 0n;
        
        if (market.outcome === 1) userShares = await marketContract.yesShares(signerAddress);
        else if (market.outcome === 2) userShares = await marketContract.noShares(signerAddress);
        else if (market.outcome === 3) userShares = (await marketContract.yesShares(signerAddress)) + (await marketContract.noShares(signerAddress));
        
        setEligibility({ hasClaimed: claimed, canClaim: userShares > 0n });
      } catch(e) {
        console.error(e);
      }
    };
    checkEligibility();
  }, [signerAddress, market.outcome, market.marketAddress]);

  const buyShares = async (isYes) => {
    if (!signerAddress) return alert("Please connect wallet first");
    setLoading(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const { usdc, marketAbi } = await getContracts(signer);
      
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      const amount = ethers.parseEther(betAmount.toString() || "0");
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      // Approve
      const approveTx = await usdc.approve(market.marketAddress, amount);
      await approveTx.wait();
      
      // Buy
      const tx = await marketContract.buyShares(isYes, amount);
      await tx.wait();
      
      alert("Trade successful on X Layer!");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Trade failed: " + e.message);
    }
    setLoading(false);
  };

  const claimWinnings = async () => {
    if (!signerAddress) return alert("Please connect wallet first");
    setLoading(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const { marketAbi } = await getContracts(signer);
      
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      
      const tx = await marketContract.claim();
      await tx.wait();
      
      alert("Winnings claimed successfully!");
    } catch (e) {
      console.error(e);
      alert("Claim failed. Ensure you have winning shares and haven't claimed already.");
    }
    setLoading(false);
  };

  return (
    <div 
      className="glass-panel market-card p-6 flex flex-col justify-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '100%' }}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {market.agentName}
          </span>
          <span className="flex items-center gap-2 text-xs text-secondary">
            <Clock size={12} /> {market.expiresIn}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-6">Will agent hit {market.metric}?</h3>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span style={{ color: 'var(--success)' }}>Yes {yesPercent}%</span>
            <span style={{ color: 'var(--danger)' }}>No {noPercent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-yes" style={{ width: `${yesPercent}%` }}></div>
            <div className="progress-no" style={{ width: `${noPercent}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
        <div className="text-xs text-muted font-medium">
          Pool: ${(totalPool).toLocaleString()}
        </div>
        
        {market.outcome === 0 ? (
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-transparent border-b border-gray-600 text-white text-sm w-16 px-1 focus:outline-none focus:border-[var(--accent-primary)]"
              style={{ textAlign: 'center' }}
            />
            <span className="text-xs text-muted mr-2">USDC</span>
            <button 
              className="btn btn-outline" 
              onClick={() => buyShares(true)}
              disabled={loading}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Tx...' : 'YES'}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => buyShares(false)}
              disabled={loading}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Tx...' : 'NO'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold mr-2" style={{ color: market.outcome === 1 ? 'var(--success)' : market.outcome === 2 ? 'var(--danger)' : 'gray' }}>
              {market.outcome === 1 ? "YES WON" : market.outcome === 2 ? "NO WON" : "VOIDED"}
            </span>
            {eligibility.canClaim ? (
              <button 
                className="btn btn-primary" 
                onClick={claimWinnings}
                disabled={loading || eligibility.hasClaimed}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.8rem', 
                  opacity: loading || eligibility.hasClaimed ? 0.5 : 1,
                  cursor: eligibility.hasClaimed ? 'not-allowed' : 'pointer'
                }}
              >
                {eligibility.hasClaimed ? 'Claimed' : (loading ? 'Tx...' : 'Claim Winnings')}
              </button>
            ) : (
               <span className="text-xs text-muted italic">No winnings</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
