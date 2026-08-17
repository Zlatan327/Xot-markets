"use client";
import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Clock, ArrowUpRight, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { getPublicProvider, getContracts } from "../lib/contracts";
import { ethers } from "ethers";

export default function MarketTable({ markets, onSelectMarket, onOpenResearch, signerAddress }) {
  const [positionsMap, setPositionsMap] = useState({});

  useEffect(() => {
    if (!signerAddress || !markets || markets.length === 0) {
      setPositionsMap({});
      return;
    }

    const fetchAllPositions = async () => {
      try {
        const provider = getPublicProvider();
        const { marketAbi } = await getContracts(provider);

        const results = {};
        await Promise.all(
          markets.map(async (market) => {
            try {
              const contract = new ethers.Contract(market.marketAddress, marketAbi, provider);
              const [yesBN, noBN] = await Promise.all([
                contract.yesShares(signerAddress),
                contract.noShares(signerAddress)
              ]);
              const yes = parseFloat(ethers.formatEther(yesBN));
              const no = parseFloat(ethers.formatEther(noBN));
              if (yes > 0 || no > 0) {
                results[market.marketAddress] = { yes, no };
              }
            } catch (err) {
              // ignore single market errors
            }
          })
        );
        setPositionsMap(results);
      } catch (e) {
        console.error("Error reading table positions:", e);
      }
    };

    fetchAllPositions();
    const interval = setInterval(fetchAllPositions, 8000);
    return () => clearInterval(interval);
  }, [signerAddress, markets]);

  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      background: '#0d1117',
      border: '1px solid #21262d',
      borderRadius: '10px'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.85rem',
        color: '#f0f6fc'
      }}>
        <thead>
          <tr style={{
            borderBottom: '1px solid #21262d',
            background: '#161b22',
            color: '#8b949e',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <th style={{ padding: '12px 16px' }}>Agent & Category</th>
            <th style={{ padding: '12px 16px' }}>Proposition Market</th>
            <th style={{ padding: '12px 16px', textAlign: 'center' }}>Live Chance</th>
            <th style={{ padding: '12px 16px', textAlign: 'center' }}>Share Prices</th>
            <th style={{ padding: '12px 16px', textAlign: 'center' }}>Your Position</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Liquidity</th>
            <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => {
            const agent = market.agentDetails || {};
            const totalPool = (market.poolYes || 0) + (market.poolNo || 0);
            const yesProb = totalPool === 0 ? 0.5 : (market.poolYes / totalPool);
            const noProb = totalPool === 0 ? 0.5 : (market.poolNo / totalPool);
            const yesPercent = Math.round(yesProb * 100);
            const noPercent = 100 - yesPercent;
            const yesPriceCents = (yesProb * 100).toFixed(0);
            const noPriceCents = (noProb * 100).toFixed(0);
            const pos = positionsMap[market.marketAddress];

            return (
              <tr 
                key={market.marketAddress}
                style={{
                  borderBottom: '1px solid #21262d',
                  transition: 'background 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#161b22'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Agent Identity */}
                <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onOpenResearch && onOpenResearch(market)}>
                    <img 
                      src={agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${market.targetAgent}&backgroundColor=050505`}
                      alt={agent.name}
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #30363d' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#f0f6fc' }}>
                          {agent.name || market.agentName}
                        </span>
                        <CheckCircle2 size={13} color="var(--glow-cyan)" />
                      </div>
                      <span style={{
                        color: agent.badgeColor || 'var(--glow-cyan)',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {agent.category || "AI Agent"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Proposition Question */}
                <td style={{ padding: '14px 16px', verticalAlign: 'middle', maxWidth: '300px' }}>
                  <div 
                    onClick={() => onOpenResearch && onOpenResearch(market)}
                    style={{ fontWeight: '600', fontSize: '13px', color: '#f0f6fc', cursor: 'pointer', lineHeight: '1.4' }}
                  >
                    {agent.question || `Will agent hit ${market.metric}?`}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '11px' }}>
                    <span style={{ color: '#8b949e' }}>Incurred Vol: <strong style={{ color: '#39d353' }}>{agent.research?.allTimeVolume || "$48.2M"}</strong></span>
                    <button
                      onClick={() => onOpenResearch && onOpenResearch(market)}
                      style={{ background: 'none', border: 'none', color: 'var(--glow-cyan)', cursor: 'pointer', padding: 0, fontSize: '11px', textDecoration: 'underline' }}
                    >
                      Dossier
                    </button>
                  </div>
                </td>

                {/* Live Chance */}
                <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: yesPercent >= 50 ? 'rgba(88, 166, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '6px', border: yesPercent >= 50 ? '1px solid rgba(88, 166, 255, 0.3)' : '1px solid #30363d' }}>
                    <span style={{ color: yesPercent >= 50 ? '#58a6ff' : '#8b949e', fontWeight: '800', fontSize: '14px' }}>
                      {yesPercent}%
                    </span>
                    {yesPercent >= 50 ? <TrendingUp size={13} color="#39d353" /> : <TrendingDown size={13} color="#f85149" />}
                  </div>
                </td>

                {/* Share Prices in Cents */}
                <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ background: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(88, 166, 255, 0.25)' }}>
                      YES {yesPriceCents}¢
                    </span>
                    <span style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#8b949e', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', border: '1px solid #30363d' }}>
                      NO {noPriceCents}¢
                    </span>
                  </div>
                </td>

                {/* Dedicated Your Position Column */}
                <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                  {pos && (pos.yes > 0 || pos.no > 0) ? (
                    <span style={{
                      background: 'rgba(57, 211, 83, 0.12)',
                      border: '1px solid rgba(57, 211, 83, 0.35)',
                      color: '#39d353',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles size={11} /> {pos.yes > 0 ? `${pos.yes.toFixed(1)} YES` : `${pos.no.toFixed(1)} NO`}
                    </span>
                  ) : (
                    <span style={{ color: '#484f58', fontSize: '12px' }}>—</span>
                  )}
                </td>

                {/* TVL */}
                <td style={{ padding: '14px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#f0f6fc' }}>
                    ${totalPool.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span style={{ fontSize: '10px', color: '#8b949e' }}>USDC</span>
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: market.outcome === 0 ? 'rgba(57, 211, 83, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: market.outcome === 0 ? '1px solid rgba(57, 211, 83, 0.25)' : '1px solid #30363d',
                    color: market.outcome === 0 ? '#39d353' : '#8b949e',
                    fontWeight: '600'
                  }}>
                    {market.expiresIn}
                  </span>
                </td>

                {/* Action */}
                <td style={{ padding: '14px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                  <button 
                    onClick={() => onSelectMarket(market)}
                    style={{
                      background: '#1f6feb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {market.outcome === 0 ? 'Trade' : 'View'} <ArrowUpRight size={13} />
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
