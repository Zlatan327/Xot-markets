"use client";

import { useState, useEffect } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, Sparkles, Cpu, Search, Filter, Layers, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';
import { getPublicProvider, getContracts } from '../lib/contracts';
import { getAgentMetadata } from '../lib/agents';
import { ethers } from 'ethers';
import { useAppKit, useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const provider = getPublicProvider();
      const { factory, marketAbi } = await getContracts(provider);
      
      const liveMarkets = [];
      for (let i = 0; i < 20; i++) {
        try {
          const marketAddress = await factory.deployedMarkets(i);
          const marketContract = new ethers.Contract(marketAddress, marketAbi, provider);
          
          const [agent, metricType, threshold, totalYes, totalNo, outcome] = await Promise.all([
            marketContract.targetAgent(),
            marketContract.metricType(),
            marketContract.metricThreshold(),
            marketContract.totalYesPool(),
            marketContract.totalNoPool(),
            marketContract.finalOutcome()
          ]);
          
          const agentDetails = getAgentMetadata(agent, Number(metricType), threshold);
          
          liveMarkets.push({
            id: marketAddress,
            marketAddress,
            targetAgent: agent,
            agentName: agentDetails.name,
            agentDetails,
            metric: agentDetails.metricFormatted,
            poolYes: Number(ethers.formatEther(totalYes)),
            poolNo: Number(ethers.formatEther(totalNo)),
            outcome: Number(outcome),
            expiresIn: Number(outcome) === 0 ? "Live" : "Resolved"
          });
        } catch (e) {
          // Break when out of bounds of deployedMarkets array
          break;
        }
      }
      setMarkets(liveMarkets);
    } catch (e) {
      console.error("Failed to fetch on-chain markets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && walletProvider && address) {
        try {
          const ethersProvider = new ethers.BrowserProvider(walletProvider);
          const signer = await ethersProvider.getSigner();
          const { usdc } = await getContracts(signer);
          const bal = await usdc.balanceOf(address);
          setUsdcBalance(Number(ethers.formatUnits(bal, 6)).toFixed(2));
        } catch (e) {
          console.error("Failed to fetch USDC balance", e);
        }
      } else {
        setUsdcBalance("0");
      }
    };
    fetchBalance();
  }, [isConnected, walletProvider, address]);

  // Filtering by category & search query
  const filteredMarkets = markets.filter(m => {
    const matchesCategory = selectedCategory === "ALL" || 
      (m.agentDetails?.category && m.agentDetails.category.toUpperCase().includes(selectedCategory.toUpperCase()));
    const matchesSearch = searchQuery === "" || 
      m.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.agentDetails?.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.marketAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["ALL", "DeFi Arbitrage", "Yield Aggregation", "Market Making", "Security & MEV"];

  return (
    <>
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--glow-cyan)] flex items-center justify-center">
            <Sparkles size={14} color="#050505" />
          </div>
          <span className="font-bold text-xl tracking-tight">XOT MARKETS</span>
          <span className="tech-tag" style={{ fontSize: '0.65rem', marginLeft: '0.5rem', background: 'rgba(0, 240, 255, 0.08)' }}>
            X Layer Testnet
          </span>
        </div>
        
        <div className="nav-links hidden md:flex">
          <a href="#" className="nav-link active">Markets</a>
          <a href="https://www.okx.com/web3/marketplace/agents" target="_blank" rel="noreferrer" className="nav-link">Agents</a>
          <a href="https://github.com/agent-odds/contracts" target="_blank" rel="noreferrer" className="nav-link">Contracts</a>
          <a href="https://www.okx.com/web3/build/x-layer" target="_blank" rel="noreferrer" className="nav-link">Docs</a>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected && address && (
            <div className="flex items-center gap-2 font-mono text-sm border border-[var(--border-subtle)] px-3 py-1.5 rounded bg-[rgba(255,255,255,0.03)]">
              <span className="text-[var(--text-muted)] text-xs">USDC:</span>
              <span className="text-[var(--glow-green)] font-bold">${usdcBalance}</span>
            </div>
          )}
          <appkit-button />
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ marginTop: '5rem' }}>
        
        {/* Split Hero */}
        <section className="hero-split">
          <div className="hero-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0, 240, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
              <Sparkles size={12} color="var(--glow-cyan)" />
              <span className="font-mono text-xs text-[var(--glow-cyan)]">Autonomous Agent Prediction Layer</span>
            </div>
            <h1>Bet on AI Agent Performance.</h1>
            <p>
              Polymarket-style prediction markets for autonomous AI agents on X Layer. Real-time on-chain verification, Aave yield routing, and guaranteed smart contract settlement.
            </p>
            <div className="flex gap-4">
              <a href="#markets-section" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                EXPLORE PREDICTION MARKETS
              </a>
              <button 
                className="btn-outline" 
                onClick={fetchMarkets}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH ON-CHAIN DATA
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="glowing-core">
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', textAlign: 'center' }}>
                <Cpu size={48} color="var(--glow-cyan)" />
                <div className="font-mono text-[var(--glow-cyan)] mt-2 text-xs">XOT_ORACLE_V2</div>
              </div>
            </div>
          </div>
        </section>

        {/* Markets Section */}
        <section id="markets-section" className="mt-8 mb-8">
          {/* Section Title & System Status */}
          <div className="flex justify-between items-center mb-6 border-b border-[var(--border-subtle)] pb-4 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} color="var(--glow-blue)" /> LIVE AGENT MARKETS
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Verified autonomous agent contracts settled via decentralized metric oracles.
              </p>
            </div>
            <div className="font-mono text-xs flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <span>CHAIN:</span>
                <span className="text-[var(--text-main)] font-semibold">X Layer Testnet (195)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--glow-green)] animate-pulse"></span>
                <span style={{ color: 'var(--glow-green)' }}>ORACLES ONLINE</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? 'var(--glow-blue)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--glow-blue)' : 'var(--border-subtle)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat === "ALL" ? "ALL MARKETS" : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem 0.75rem', gap: '0.5rem', width: '260px' }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search agent or market..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
              />
            </div>
          </div>

          {/* Markets Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-[var(--glow-cyan)] font-mono gap-3 border border-[var(--border-subtle)] rounded-lg bg-[rgba(0,0,0,0.4)]">
              <Activity className="animate-spin" size={28} />
              <span>SYNCHRONIZING ON-CHAIN AGENTS FROM X LAYER TESTNET...</span>
            </div>
          ) : filteredMarkets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <Cpu size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="font-bold text-lg mb-2">No Markets Match Filter</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Try selecting "ALL MARKETS" or clearing your search term.</p>
              <button className="btn-outline" onClick={() => { setSelectedCategory("ALL"); setSearchQuery(""); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-auto">
              {filteredMarkets.map((market, idx) => (
                <MarketCard key={market.marketAddress || idx} market={market} signerAddress={isConnected ? address : null} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
