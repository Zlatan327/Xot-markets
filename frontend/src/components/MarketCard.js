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
      className="market-card p-6 flex flex-col justify-between bg-white text-black border-4 border-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '100%', boxShadow: '8px 8px 0px black' }}
    >
      <div>
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <span className="text-xs font-black" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
            {market.agentName}
          </span>
          <span className="flex items-center gap-2 text-xs font-bold bg-black text-white px-2 py-1">
            <Clock size={12} /> {market.expiresIn}
          </span>
        </div>
        
        <h3 className="text-xl font-black mb-6 uppercase leading-tight">Will agent hit {market.metric}?</h3>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 font-black uppercase">
            <span>Yes {yesPercent}%</span>
            <span>No {noPercent}%</span>
          </div>
          <div className="progress-bar-bg border-2 border-black" style={{ height: '16px' }}>
            <div className="progress-yes" style={{ width: `${yesPercent}%` }}></div>
            <div className="progress-no" style={{ width: `${noPercent}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-black">
        <div className="text-sm font-black uppercase">
          Pool: ${(totalPool).toLocaleString()}
        </div>
        
        {market.outcome === 0 ? (
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-transparent border-b-2 border-black text-black text-sm w-16 px-1 focus:outline-none font-bold"
              style={{ textAlign: 'center' }}
            />
            <span className="text-xs font-black mr-2">USDC</span>
            <button 
              className="btn font-black transition-all border-2 border-black hover:bg-black hover:text-white" 
              onClick={() => buyShares(true)}
              disabled={loading}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'WAIT' : 'YES'}
            </button>
            <button 
              className="btn font-black transition-all border-2 border-black bg-black text-white hover:bg-white hover:text-black" 
              onClick={() => buyShares(false)}
              disabled={loading}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'WAIT' : 'NO'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-black mr-2 uppercase bg-black text-white px-2 py-1">
              {market.outcome === 1 ? "YES WON" : market.outcome === 2 ? "NO WON" : "VOIDED"}
            </span>
            {eligibility.canClaim ? (
              <button 
                className="btn font-black transition-all border-2 border-black bg-white text-black hover:bg-black hover:text-white" 
                onClick={claimWinnings}
                disabled={loading || eligibility.hasClaimed}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.8rem', 
                  opacity: loading || eligibility.hasClaimed ? 0.5 : 1,
                  cursor: eligibility.hasClaimed ? 'not-allowed' : 'pointer'
                }}
              >
                {eligibility.hasClaimed ? 'CLAIMED' : (loading ? 'WAIT' : 'CLAIM WINNINGS')}
              </button>
            ) : (
               <span className="text-xs font-bold italic">NO WINNINGS</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
