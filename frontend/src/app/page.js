"use client";

import { useState } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, ChevronRight } from 'lucide-react';

export default function Home() {
  const [wallet, setWallet] = useState(null);
  
  const mockMarkets = [
    {
      id: "0x1a2b...3c4d",
      agentName: "AlphaTrader-X",
      metric: "Volume > 10M",
      poolYes: 45000,
      poolNo: 15000,
      expiresIn: "4 hours"
    },
    {
      id: "0x9f8e...7d6c",
      agentName: "YieldOptimizer-Bot",
      metric: "APY > 15%",
      poolYes: 80000,
      poolNo: 120000,
      expiresIn: "12 hours"
    },
    {
      id: "0x4b5c...6d7e",
      agentName: "ArbScanner-Pro",
      metric: "Executions > 500",
      poolYes: 25000,
      poolNo: 25000,
      expiresIn: "2 days"
    },
    {
      id: "0x7d8e...9f0a",
      agentName: "LiquidityManager",
      metric: "TVL > 50M",
      poolYes: 150000,
      poolNo: 50000,
      expiresIn: "5 days"
    },
    {
      id: "0x2c3d...4e5f",
      agentName: "SniperBot-V2",
      metric: "Profit > 5 ETH",
      poolYes: 10000,
      poolNo: 90000,
      expiresIn: "1 hour"
    }
  ];

  const connectWallet = () => {
    setWallet("0x31b4...e84e1");
  };

  return (
    <main className="container">
      <nav className="flex justify-between items-center mb-8 glass-panel p-4">
        <div className="flex items-center gap-2">
          <Zap size={24} color="var(--accent-primary)" />
          <span className="text-xl font-bold text-gradient">Xot Markets</span>
        </div>
        <div>
          {wallet ? (
            <span className="btn btn-outline">{wallet}</span>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <section className="text-center mb-8 glass-panel p-8">
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          AI Performance Prediction Markets
        </h1>
        <p className="text-secondary text-lg mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
          Trade on the execution metrics, yields, and volumes of autonomous AI agents operating on X Layer. Powered by optimistic resolution and Aave V3 principal routing.
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-primary flex items-center gap-2">
            Start Trading <ChevronRight size={18} />
          </button>
          <button className="btn btn-outline flex items-center gap-2">
            <Activity size={18} /> Agent Leaderboard
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity size={20} color="var(--accent-secondary)" /> 
            Active Markets
          </h2>
          <span className="text-sm text-muted">Showing {mockMarkets.length} markets</span>
        </div>
        
        <div className="grid grid-cols-auto">
          {mockMarkets.map((market, idx) => (
            <MarketCard key={idx} market={market} />
          ))}
        </div>
      </section>

      <footer className="mt-8 text-center text-muted text-sm p-6 glass-panel">
        <p>Built for BuildX AI Season Hackathon on X Layer.</p>
        <p className="mt-2 flex items-center justify-center gap-2">
          <Shield size={14} /> Secured by Optimistic Oracles
        </p>
      </footer>
    </main>
  );
}
