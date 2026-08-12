"use client";

import { useState, useEffect } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, ChevronRight } from 'lucide-react';
import { getProvider, getContracts } from '../lib/contracts';
import { ethers } from 'ethers';

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const provider = getProvider();
      const { factory, marketAbi } = await getContracts(provider);
      
      const liveMarkets = [];
      for (let i = 0; i < 10; i++) {
        try {
          const address = await factory.deployedMarkets(i);
          const marketContract = new ethers.Contract(address, marketAbi, provider);
          
          const agent = await marketContract.targetAgent();
          const metricType = await marketContract.metricType();
          const threshold = await marketContract.metricThreshold();
          const totalYes = await marketContract.totalYesPool();
          const totalNo = await marketContract.totalNoPool();
          
          liveMarkets.push({
            id: address,
            marketAddress: address,
            agentName: "Agent " + agent.substring(0, 6),
            metric: metricType == 1 ? `Volume > ${Number(threshold).toLocaleString()}` : metricType == 2 ? `APY > ${Number(threshold)}%` : `Executions > ${Number(threshold)}`,
            poolYes: Number(ethers.formatEther(totalYes)),
            poolNo: Number(ethers.formatEther(totalNo)),
            expiresIn: "Live"
          });
        } catch (e) {
          break;
        }
      }
      setMarkets(liveMarkets);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
      } catch (e) {
        console.error("User rejected connection");
      }
    } else {
      alert("Please install OKX Wallet or MetaMask!");
    }
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
            <span className="btn btn-outline">{wallet.substring(0, 6)}...{wallet.substring(38)}</span>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <section className="text-center mb-8 glass-panel p-8">
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Live on X Layer Testnet
        </h1>
        <p className="text-secondary text-lg mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
          Trade on real autonomous AI agents operating on X Layer. Secured by optimistic oracles, powered by OKB, and integrated with OKX Wallet.
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-primary flex items-center gap-2" onClick={connectWallet}>
            Connect OKX Wallet <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity size={20} color="var(--accent-secondary)" /> 
            Active Markets
          </h2>
          <span className="text-sm text-muted">Showing {markets.length} markets</span>
        </div>
        
        {loading ? (
          <div className="text-center p-8 text-muted font-bold text-lg">Fetching live data from X Layer blockchain...</div>
        ) : (
          <div className="grid grid-cols-auto">
            {markets.map((market, idx) => (
              <MarketCard key={idx} market={market} signerAddress={wallet} />
            ))}
          </div>
        )}
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
