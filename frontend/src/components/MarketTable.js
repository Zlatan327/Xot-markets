"use client";
import { useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

export default function MarketTable({ markets, onSelectMarket, signerAddress }) {
  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      background: 'var(--bg-panel)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.85rem'
      }}>
        <thead>
          <tr style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <th style={{ padding: '1rem 1.25rem' }}>Agent & Category</th>
            <th style={{ padding: '1rem 1.25rem' }}>Proposition Question</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>YES Odds</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>NO Odds</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Total Liquidity</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => {
            const agent = market.agentDetails || {};
            const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
            const yesPercent = totalPool === 0 ? 50 : Math.round((market.poolYes / totalPool) * 100);
            const noPercent = totalPool === 0 ? 50 : 100 - yesPercent;
            const explorerUrl = `https://www.okx.com/explorer/xlayer-test/address/${market.marketAddress}`;

            return (
              <tr 
                key={market.marketAddress}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.2s'
                }}
                className="hover:bg-[rgba(255,255,255,0.02)]"
              >
                {/* Agent Identity */}
                <td style={{ padding: '1rem 1.25rem', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${market.targetAgent}&backgroundColor=050505`}
                      alt={agent.name}
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span className="font-bold text-main" style={{ fontSize: '0.9rem' }}>
                          {agent.name || market.agentName}
                        </span>
                        <CheckCircle2 size={13} color="var(--glow-cyan)" />
                      </div>
                      <span style={{
                        color: agent.badgeColor || 'var(--glow-cyan)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {agent.category || "AI Agent"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Proposition Question */}
                <td style={{ padding: '1rem 1.25rem', verticalAlign: 'middle', maxWidth: '340px' }}>
                  <span className="font-bold text-main" style={{ fontSize: '0.875rem', lineHeight: '1.3' }}>
                    {agent.question || `Will agent hit ${market.metric}?`}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <a 
                      href={explorerUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                      className="hover:text-white"
                    >
                      Contract <ExternalLink size={9} />
                    </a>
                  </div>
                </td>

                {/* YES Odds */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span style={{
                    color: 'var(--glow-blue)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'rgba(0, 112, 243, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 112, 243, 0.2)'
                  }}>
                    {yesPercent}%
                  </span>
                </td>

                {/* NO Odds */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span style={{
                    color: '#aaa',
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {noPercent}%
                  </span>
                </td>

                {/* TVL */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right', verticalAlign: 'middle' }}>
                  <div className="font-mono text-main" style={{ fontWeight: 600 }}>
                    ${totalPool.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>USDC</span>
                </td>

                {/* Status */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span className={`tech-tag ${market.outcome !== 0 ? 'ended' : ''}`} style={{ fontSize: '0.7rem' }}>
                    <Clock size={10} /> {market.expiresIn}
                  </span>
                </td>

                {/* Trade Button */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right', verticalAlign: 'middle' }}>
                  <button 
                    className="btn-primary" 
                    onClick={() => onSelectMarket(market)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {market.outcome === 0 ? 'TRADE' : 'VIEW'} <ArrowUpRight size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
