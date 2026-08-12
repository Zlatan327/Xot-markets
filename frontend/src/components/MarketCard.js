"use client";
import { useState, useEffect } from 'react';
import { Clock, Activity } from 'lucide-react';
import { getProvider, getContracts } from '../lib/contracts';
import { ethers } from 'ethers';

export default function MarketCard({ market, signerAddress }) {
  const [approving, setApproving] = useState(false);
  const [buyingYes, setBuyingYes] = useState(false);
  const [buyingNo, setBuyingNo] = useState(false);
  const [claiming, setClaiming] = useState(false);
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

  const approveUSDC = async () => {
    if (!signerAddress) return alert("Please connect wallet first");
    setApproving(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const { usdc } = await getContracts(signer);
      
      const amount = ethers.parseUnits(betAmount.toString() || "0", 6);
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      const tx = await usdc.approve(market.marketAddress, amount);
      await tx.wait();
      alert("Approved successfully!");
    } catch (e) {
      console.error(e);
      alert("Approval failed: " + e.message);
    }
    setApproving(false);
  };

  const buyShares = async (isYes) => {
    if (!signerAddress) return alert("Please connect wallet first");
    isYes ? setBuyingYes(true) : setBuyingNo(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const { marketAbi } = await getContracts(signer);
      
      const marketContract = new ethers.Contract(market.marketAddress, marketAbi, signer);
      const amount = ethers.parseUnits(betAmount.toString() || "0", 6);
      if (amount <= 0n) return alert("Enter a valid bet amount");
      
      const tx = await marketContract.buyShares(isYes, amount);
      await tx.wait();
      
      alert("Trade successful on X Layer!");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Trade failed: " + e.message);
    }
    isYes ? setBuyingYes(false) : setBuyingNo(false);
  };

  const claimWinnings = async () => {
    if (!signerAddress) return alert("Please connect wallet first");
    setClaiming(true);
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
    setClaiming(false);
  };

  // Extract the raw address from the "Agent 0x..." string
  const rawAddress = market.marketAddress ? market.agentName.replace('Agent ', '').toLowerCase() : '';
  const explorerUrl = `https://www.okx.com/explorer/xlayer-test/address/${rawAddress}`;

  return (
    <div className="infra-node">
      {/* Header */}
      <div className="node-header">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="tech-tag bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)]">
              ID: {market.agentName}
            </span>
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="tech-tag hover:bg-[rgba(0,240,255,0.2)] transition-colors cursor-pointer"
              title="View Agent Contract on X Layer Explorer"
            >
              <Activity size={12} /> View on Explorer ↗
            </a>
          </div>
          <span className="font-bold text-lg mt-2 tracking-tight">
            Will agent hit {market.metric}?
          </span>
        </div>
        <div className={`tech-tag ${market.outcome !== 0 ? 'ended' : ''}`}>
          <Clock size={12} /> {market.expiresIn}
        </div>
      </div>
      
      {/* Body */}
      <div className="node-body">
        <div className="mb-4">
          <p className="text-sm text-[var(--text-muted)]">
            Verified On-Chain Agent on X Layer. Resolves directly via smart contract metrics.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <div className="data-value">YES {yesPercent}%</div>
          <div className="data-value" style={{ color: 'var(--text-muted)' }}>NO {noPercent}%</div>
        </div>
        
        <div className="bar-container mb-4">
          <div className="bar-yes" style={{ width: `${yesPercent}%` }}></div>
          <div className="bar-no" style={{ width: `${noPercent}%` }}></div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="node-footer">
        <div className="flex flex-col">
          <span className="text-sm text-[var(--text-muted)]">TVL</span>
          <span className="data-value">${(totalPool).toLocaleString()}</span>
        </div>
        
        {market.outcome === 0 ? (
          <div className="flex flex-col gap-3 w-full mt-2">
            <div className="flex items-center gap-4">
              <div className="terminal-input flex items-center">
                <span>&gt;</span>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-16 bg-transparent outline-none ml-2 text-white"
                />
                <span className="text-gray-400 ml-2 text-sm">${parseFloat(betAmount || 0).toFixed(2)} USD</span>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <button className="btn-outline flex-1" onClick={approveUSDC} disabled={approving}>
                {approving ? 'APPROVING...' : '1. APPROVE'}
              </button>
              <button className="btn-primary flex-1" onClick={() => buyShares(true)} disabled={buyingYes}>
                {buyingYes ? 'BUYING...' : '2. YES'}
              </button>
              <button className="btn-outline flex-1" onClick={() => buyShares(false)} disabled={buyingNo}>
                {buyingNo ? 'BUYING...' : '2. NO'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="tech-tag">
              {market.outcome === 1 ? "YES WON" : market.outcome === 2 ? "NO WON" : "VOIDED"}
            </span>
            {eligibility.canClaim ? (
              <button className="btn-primary" onClick={claimWinnings} disabled={claiming || eligibility.hasClaimed}>
                {eligibility.hasClaimed ? 'CLAIMED' : (claiming ? 'CLAIMING...' : 'CLAIM')}
              </button>
            ) : (
               <span className="tech-tag ended">NO SHARES</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
