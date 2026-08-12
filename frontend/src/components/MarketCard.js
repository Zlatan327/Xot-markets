"use client";
import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function MarketCard({ market }) {
  const [hovered, setHovered] = useState(false);
  
  const totalPool = market.poolYes + market.poolNo;
  const yesPercent = Math.round((market.poolYes / totalPool) * 100);
  const noPercent = 100 - yesPercent;

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
        <div className="flex gap-2">
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
            Buy YES
          </button>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            Buy NO
          </button>
        </div>
      </div>
    </div>
  );
}
