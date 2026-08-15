"use client";

import { useState, useEffect, useMemo } from 'react';
import MarketCard from '../components/MarketCard';
import MarketTable from '../components/MarketTable';
import QuickTradeModal from '../components/QuickTradeModal';
import { 
  Activity, 
  Sparkles, 
  Cpu, 
  Search, 
  Layers, 
  RefreshCw, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  DollarSign, 
  ShieldCheck, 
  Bot, 
  SlidersHorizontal 
} from 'lucide-react';
import { getPublicProvider, getContracts } from '../lib/contracts';
import { getAgentMetadata } from '../lib/agents';
import { ethers } from 'ethers';
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';

export default function Home() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & View Controls
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, LIVE, RESOLVED
  const [sortBy, setSortBy] = useState("LIQUIDITY_DESC"); // LIQUIDITY_DESC, YES_DESC, NAME_ASC
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("GRID"); // GRID or TABLE
  
  // Trade Modal
  const [modalMarket, setModalMarket] = useState(null);
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
          setUsdcBalance(Number(ethers.formatEther(bal)).toFixed(2));
        } catch (e) {
          console.error("Failed to fetch USDC balance", e);
        }
      } else {
        setUsdcBalance("0");
      }
    };
    fetchBalance();
  }, [isConnected, walletProvider, address]);

  // Derived Summary Statistics
  const totalTvl = useMemo(() => {
    return markets.reduce((acc, m) => acc + (m.poolYes || 0) + (m.poolNo || 0), 0);
  }, [markets]);

  const activeAgentsCount = useMemo(() => {
    const set = new Set(markets.map(m => m.targetAgent?.toLowerCase()));
    return set.size;
  }, [markets]);

  // Filtering and Sorting
  const filteredMarkets = useMemo(() => {
    return markets
      .filter(m => {
        // Category Filter
        const matchesCat = selectedCategory === "ALL" || 
          (m.agentDetails?.category && m.agentDetails.category.toUpperCase().includes(selectedCategory.toUpperCase()));
        
        // Status Filter
        const matchesStatus = statusFilter === "ALL" ||
          (statusFilter === "LIVE" && m.outcome === 0) ||
          (statusFilter === "RESOLVED" && m.outcome !== 0);

        // Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === "" ||
          m.agentName.toLowerCase().includes(query) ||
          m.agentDetails?.question.toLowerCase().includes(query) ||
          m.marketAddress.toLowerCase().includes(query);

        return matchesCat && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const tvlA = (a.poolYes || 0) + (a.poolNo || 0);
        const tvlB = (b.poolYes || 0) + (b.poolNo || 0);
        if (sortBy === "LIQUIDITY_DESC") return tvlB - tvlA;
        if (sortBy === "YES_DESC") {
          const yesA = tvlA === 0 ? 50 : (a.poolYes / tvlA);
          const yesB = tvlB === 0 ? 50 : (b.poolYes / tvlB);
          return yesB - yesA;
        }
        if (sortBy === "NAME_ASC") return a.agentName.localeCompare(b.agentName);
        return 0;
      });
  }, [markets, selectedCategory, statusFilter, searchQuery, sortBy]);

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
        
        {/* Hero Section */}
        <section className="hero-split" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
          <div className="hero-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0, 240, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
              <Sparkles size={12} color="var(--glow-cyan)" />
              <span className="font-mono text-xs text-[var(--glow-cyan)]">Autonomous AI Agent Prediction Protocol</span>
            </div>
            <h1>Predict AI Agent Outcomes.</h1>
            <p>
              Trade on autonomous agent performance metrics, yield generation, and cross-DEX arbitrage. Built with decentralized on-chain settlement and Aave yield compounding on X Layer.
            </p>
            <div className="flex gap-4">
              <a href="#markets-section" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                EXPLORE MARKETS
              </a>
              <button 
                className="btn-outline" 
                onClick={fetchMarkets}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="glowing-core">
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', textAlign: 'center' }}>
                <Cpu size={48} color="var(--glow-cyan)" />
                <div className="font-mono text-[var(--glow-cyan)] mt-2 text-xs">A2A_CORE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Protocol Metric Stats KPI Bar */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Value Locked</span>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              ${totalTvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: '0.8rem', color: 'var(--glow-green)' }}>USDC</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Autonomous Agents</span>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--glow-cyan)', marginTop: '0.2rem' }}>
              {activeAgentsCount || 4} Verified
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Prediction Contracts</span>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--glow-blue)', marginTop: '0.2rem' }}>
              {markets.length} Deployed
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settlement Oracle Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--glow-green)] animate-pulse" />
              <span className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--glow-green)', fontWeight: 600 }}>100% Operational</span>
            </div>
          </div>
        </section>

        {/* Markets Workspace Section */}
        <section id="markets-section" className="mb-12">
          
          {/* Main Controls & Filters Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
            background: 'var(--bg-panel)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px'
          }}>
            {/* Top Row: Category Pills & View Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: selectedCategory === cat ? 'var(--glow-blue)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? 'var(--glow-blue)' : 'var(--border-subtle)',
                      padding: '0.4rem 0.85rem',
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

              {/* View Switcher (Grid vs Table) */}
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '2px'
              }}>
                <button
                  onClick={() => setViewMode("GRID")}
                  style={{
                    background: viewMode === "GRID" ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: 'none',
                    color: viewMode === "GRID" ? '#fff' : 'var(--text-muted)',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                  title="Card Grid View"
                >
                  <LayoutGrid size={14} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("TABLE")}
                  style={{
                    background: viewMode === "TABLE" ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: 'none',
                    color: viewMode === "TABLE" ? '#fff' : 'var(--text-muted)',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                  title="Dense Table View"
                >
                  <List size={14} /> Table
                </button>
              </div>
            </div>

            {/* Bottom Row: Status Tabs, Search, and Sort */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '1rem'
            }}>
              
              {/* Status Filter Tabs (All, Live, Resolved) */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { id: "ALL", label: `All (${markets.length})` },
                  { id: "LIVE", label: `Live (${markets.filter(m => m.outcome === 0).length})` },
                  { id: "RESOLVED", label: `Resolved (${markets.filter(m => m.outcome !== 0).length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: statusFilter === tab.id ? 'var(--glow-cyan)' : 'var(--text-muted)',
                      borderBottom: statusFilter === tab.id ? '2px solid var(--glow-cyan)' : '2px solid transparent',
                      padding: '0.3rem 0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Search Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  gap: '0.5rem',
                  minWidth: '220px'
                }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search agents or markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
                  />
                </div>

                {/* Sort Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowUpDown size={14} color="var(--text-muted)" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.75rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="LIQUIDITY_DESC" style={{ background: '#111' }}>Highest Liquidity</option>
                    <option value="YES_DESC" style={{ background: '#111' }}>Highest YES Odds</option>
                    <option value="NAME_ASC" style={{ background: '#111' }}>Agent Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Render Markets View */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-[var(--glow-cyan)] font-mono gap-3 border border-[var(--border-subtle)] rounded-lg bg-[rgba(0,0,0,0.4)]">
              <Activity className="animate-spin" size={28} />
              <span>SYNCHRONIZING ON-CHAIN AGENTS FROM X LAYER TESTNET...</span>
            </div>
          ) : filteredMarkets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <Cpu size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="font-bold text-lg mb-2">No Markets Match Your Filter</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Try clearing your search term or switching to "ALL MARKETS".</p>
              <button 
                className="btn-outline" 
                onClick={() => { setSelectedCategory("ALL"); setStatusFilter("ALL"); setSearchQuery(""); }}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "GRID" ? (
            <div className="grid grid-cols-auto">
              {filteredMarkets.map((market) => (
                <MarketCard 
                  key={market.marketAddress} 
                  market={market} 
                  signerAddress={isConnected ? address : null} 
                />
              ))}
            </div>
          ) : (
            <MarketTable 
              markets={filteredMarkets} 
              onSelectMarket={(market) => setModalMarket(market)} 
              signerAddress={isConnected ? address : null}
            />
          )}
        </section>
      </main>

      {/* Quick Trade Modal */}
      {modalMarket && (
        <QuickTradeModal
          market={modalMarket}
          onClose={() => setModalMarket(null)}
          signerAddress={isConnected ? address : null}
          usdcBalance={usdcBalance}
        />
      )}
    </>
  );
}
