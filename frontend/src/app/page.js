"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import MarketCard from '../components/MarketCard';
import MarketTable from '../components/MarketTable';
import QuickTradeModal from '../components/QuickTradeModal';
import AgentResearchModal from '../components/AgentResearchModal';
import ContractsModal from '../components/ContractsModal';
import AgentsDirectoryModal from '../components/AgentsDirectoryModal';
import ProtocolDocsModal from '../components/ProtocolDocsModal';
import PortfolioModal from '../components/PortfolioModal';
import FaucetButton from '../components/FaucetButton';
import ActivityTicker from '../components/ActivityTicker';
import Logo from '../components/Logo';
import Hero3D from '../components/Hero3D';
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
  SlidersHorizontal,
  Wallet,
  LogOut,
  AlertTriangle,
  Coins,
  Briefcase
} from 'lucide-react';
import { getPublicProvider, getContracts } from '../lib/contracts';
import { getAgentMetadata } from '../lib/agents';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

export default function Home() {
  const { address, isConnected, isCorrectNetwork, connectWallet, disconnectWallet, switchToXLayer, connecting, signer } = useWeb3();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & View Controls
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, LIVE, RESOLVED
  const [sortBy, setSortBy] = useState("LIQUIDITY_DESC"); // LIQUIDITY_DESC, YES_DESC, NAME_ASC
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("GRID"); // GRID or TABLE
  
  // Modals
  const [modalMarket, setModalMarket] = useState(null);
  const [researchMarket, setResearchMarket] = useState(null);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [showAgentsModal, setShowAgentsModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0");

  useEffect(() => {
    fetchMarkets();
    // Auto-poll every 12s so live chances and pool odds adjust continuously
    const interval = setInterval(() => {
      fetchMarkets();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarkets = async () => {
    setLoading(prev => prev && markets.length === 0);
    try {
      const provider = getPublicProvider();
      const { factory, marketAbi } = await getContracts(provider);
      
      const liveMarkets = [];
      let marketCount;
      try {
        marketCount = Number(await factory.getMarketCount());
      } catch {
        marketCount = 0;
      }
      for (let i = 0; i < marketCount; i++) {
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
          // Skip individual market fetch errors (transient RPC failures)
          continue;
        }
      }
      setMarkets(liveMarkets);
    } catch (e) {
      console.error("Failed to fetch on-chain markets:", e);
    } finally {
      setLoading(false);
    }
  };

  const [minting, setMinting] = useState(false);

  const fetchBalance = async () => {
    if (address) {
      try {
        const provider = getPublicProvider();
        const { usdc } = await getContracts(provider);
        const bal = await usdc.balanceOf(address);
        setUsdcBalance(Number(ethers.formatEther(bal)).toFixed(2));
      } catch (e) {
        console.error("Failed to fetch USDC balance", e);
      }
    } else {
      setUsdcBalance("0");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [isConnected, address]);

  const mintFaucetUSDC = async () => {
    if (!isConnected || !signer) {
      await connectWallet();
      return;
    }
    if (!isCorrectNetwork) {
      const switched = await switchToXLayer();
      if (!switched) {
        alert("Please switch to X Layer Testnet to claim faucet.");
        return;
      }
    }
    setMinting(true);
    try {
      const { usdc } = await getContracts(signer);
      const amount = ethers.parseUnits("500", 18);
      const tx = await usdc.mint(address, amount);
      await tx.wait();
      alert("Successfully minted 500 Test USDC on X Layer Testnet!");
      await fetchBalance();
    } catch (e) {
      console.error("Mint failed:", e);
      alert("Faucet failed: " + (e.reason || e.message));
    } finally {
      setMinting(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Derived Summary Statistics
  const totalTvl = useMemo(() => {
    return markets.reduce((acc, m) => acc + (m.poolYes || 0) + (m.poolNo || 0), 0);
  }, [markets]);

  const activeAgentsCount = useMemo(() => {
    const unique = new Set(markets.map(m => m.targetAgent?.toLowerCase()));
    return unique.size;
  }, [markets]);

  const categoryDefs = [
    { id: "ALL", label: "🔥 All Markets" },
    { id: "DeFi Arbitrage", label: "⚡ DeFi Arbitrage" },
    { id: "Yield Aggregation", label: "🌾 Yield Harvesters" },
    { id: "Market Making", label: "📈 Market Making" },
    { id: "Security & MEV", label: "🛡️ Security & MEV" },
    { id: "Social & Sentiment", label: "🧠 Social & Sentiment" },
    { id: "Intent & Solvers", label: "🧩 Intent & Solvers" },
    { id: "Autonomous Protocol", label: "🤖 Autonomous Protocols" }
  ];

  // Filtering and Sorting
  const filteredMarkets = useMemo(() => {
    return markets
      .filter((m) => {
        // Category Filter
        const matchesCat = selectedCategory === "ALL" || m.agentDetails?.category === selectedCategory;

        // Status Filter
        const matchesStatus =
          statusFilter === "ALL" ||
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
  const getCategoryCount = (catId) => {
    if (catId === "ALL") return markets.length;
    return markets.filter(m => m.agentDetails?.category === catId).length;
  };

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Top Navigation Bar (Polymarket Styled) */}
      <nav className="top-nav" style={{ gap: '16px' }}>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5" style={{ flexShrink: 0 }}>
          <Logo size={28} />
          <span className="font-bold text-lg tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
            XOT MARKETS
          </span>
          <span className="tech-tag" style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.08)' }}>
            X Layer
          </span>
        </div>

        {/* Global Search Bar (Polymarket Style) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "8px",
          padding: "6px 12px",
          gap: "8px",
          flex: "1",
          maxWidth: "420px",
          transition: "border-color 0.2s"
        }}>
          <Search size={14} color="#8b949e" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search markets, AI agents, metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#f0f6fc",
              fontSize: "13px",
              outline: "none",
              width: "100%"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: "11px", padding: 0 }}
            >
              ✕
            </button>
          )}
          <span style={{
            fontSize: "11px",
            color: "#8b949e",
            background: "#21262d",
            border: "1px solid #30363d",
            borderRadius: "4px",
            padding: "1px 6px",
            fontFamily: "monospace"
          }}>
            /
          </span>
        </div>
        
        <div className="nav-links hidden md:flex" style={{ marginLeft: "auto" }}>
          <a href="#markets-section" className="nav-link active">Markets</a>
          <button onClick={() => setShowAgentsModal(true)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Agents</button>
          <button 
            onClick={() => {
              if (!isConnected) connectWallet();
              else setShowPortfolioModal(true);
            }} 
            className="nav-link" 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--glow-cyan)'
            }}
          >
            <Briefcase size={13} /> Portfolio
          </button>
          <button onClick={() => setShowContractsModal(true)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Contracts</button>
          <button onClick={() => setShowDocsModal(true)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Docs</button>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="flex items-center gap-3">
              {!isCorrectNetwork ? (
                <button 
                  onClick={switchToXLayer}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all font-mono"
                >
                  <AlertTriangle size={13} /> Switch to X Layer
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPortfolioModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(88, 166, 255, 0.12)',
                      border: '1px solid rgba(88, 166, 255, 0.35)',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      color: '#58a6ff',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    title="View your active shares and claim winnings"
                  >
                    <Briefcase size={13} />
                    <span>My Positions</span>
                  </button>

                  <div className="flex items-center gap-2 font-mono text-sm border border-[var(--border-subtle)] px-3 py-1.5 rounded bg-[rgba(255,255,255,0.03)]">
                    <span className="text-[var(--text-muted)] text-xs">USDC:</span>
                    <span className="text-[var(--glow-green)] font-bold">${usdcBalance}</span>
                  </div>
                  <FaucetButton signerAddress={address} onBalanceRefresh={fetchBalance} />
                </div>
              )}
              
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] font-mono text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-[var(--glow-green)] animate-pulse"></span>
                {formatAddress(address)}
              </div>

              <button 
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={connectWallet}
                disabled={connecting}
                className="btn-primary flex items-center gap-2 text-sm font-semibold"
              >
                <Wallet size={15} />
                {connecting ? 'CONNECTING...' : 'CONNECT WALLET'}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ marginTop: '4.5rem' }}>
        
        {/* 3D Fintech Animation Hero */}
        <Hero3D
          totalTvl={totalTvl}
          activeAgentsCount={activeAgentsCount || 8}
          onExploreClick={() => {
            const el = document.getElementById("markets-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          onOpenPortfolio={() => {
            if (!isConnected) connectWallet();
            else setShowPortfolioModal(true);
          }}
        />

        {/* Live Streaming Activity Ticker */}
        <ActivityTicker markets={markets} />

        {/* Markets Workspace Section */}
        <section id="markets-section" className="mb-12">
          
          {/* Main Category Tabs & Controls Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px',
            background: '#0d1117',
            padding: '16px',
            border: '1px solid #21262d',
            borderRadius: '10px'
          }}>
            {/* Top Row: Category Pills & View Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              
              {/* Clean Category Navigation Tabs */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                {categoryDefs.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = getCategoryCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        background: isSelected ? '#21262d' : '#161b22',
                        color: isSelected ? '#58a6ff' : '#8b949e',
                        border: isSelected ? '1px solid #58a6ff' : '1px solid #30363d',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{cat.label}</span>
                      <span style={{
                        background: isSelected ? 'rgba(88, 166, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#58a6ff' : '#8b949e',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontSize: '10px'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View Switcher (Grid vs Table) */}
              <div style={{
                display: 'flex',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '2px'
              }}>
                <button
                  onClick={() => setViewMode("GRID")}
                  style={{
                    background: viewMode === "GRID" ? '#21262d' : 'transparent',
                    border: 'none',
                    color: viewMode === "GRID" ? '#fff' : '#8b949e',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                  title="Card Grid View"
                >
                  <LayoutGrid size={13} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("TABLE")}
                  style={{
                    background: viewMode === "TABLE" ? '#21262d' : 'transparent',
                    border: 'none',
                    color: viewMode === "TABLE" ? '#fff' : '#8b949e',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                  title="Dense Table View"
                >
                  <List size={13} /> Table
                </button>
              </div>
            </div>

            {/* Bottom Row: Status Tabs, Search, and Sort */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              borderTop: '1px solid #21262d',
              paddingTop: '12px'
            }}>
              
              {/* Status Filter Tabs (All, Live, Resolved) */}
              <div style={{ display: 'flex', gap: '8px' }}>
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
                      color: statusFilter === tab.id ? 'var(--glow-cyan)' : '#8b949e',
                      borderBottom: statusFilter === tab.id ? '2px solid var(--glow-cyan)' : '2px solid transparent',
                      padding: '4px 6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={13} color="#8b949e" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    color: '#f0f6fc',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="LIQUIDITY_DESC" style={{ background: '#161b22' }}>Highest Liquidity</option>
                  <option value="YES_DESC" style={{ background: '#161b22' }}>Highest YES Chance</option>
                  <option value="NAME_ASC" style={{ background: '#161b22' }}>Agent Name (A-Z)</option>
                </select>
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
                  onOpenResearch={(m) => setResearchMarket(m)}
                />
              ))}
            </div>
          ) : (
            <MarketTable 
              markets={filteredMarkets} 
              onSelectMarket={(market) => setModalMarket(market)} 
              onOpenResearch={(m) => setResearchMarket(m)}
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
          onTradeComplete={() => fetchBalance()}
        />
      )}

      {/* Agent Deep Research & Dossier Modal */}
      {researchMarket && (
        <AgentResearchModal
          market={researchMarket}
          agentData={researchMarket.agentDetails}
          onClose={() => setResearchMarket(null)}
          onTradeClick={(m) => setModalMarket(m)}
        />
      )}

      {/* Agents Directory Leaderboard Modal */}
      {showAgentsModal && (
        <AgentsDirectoryModal
          markets={markets}
          onClose={() => setShowAgentsModal(false)}
          onSelectAgent={(market) => {
            setShowAgentsModal(false);
            setResearchMarket(market);
          }}
        />
      )}

      {/* Live Contracts & Verification Modal */}
      {showContractsModal && (
        <ContractsModal
          onClose={() => setShowContractsModal(false)}
        />
      )}

      {/* Protocol Architecture & Docs Modal */}
      {showDocsModal && (
        <ProtocolDocsModal
          onClose={() => setShowDocsModal(false)}
        />
      )}

      {/* User Portfolio & Positions Modal */}
      {showPortfolioModal && (
        <PortfolioModal
          markets={markets}
          signerAddress={isConnected ? address : null}
          onClose={() => setShowPortfolioModal(false)}
          onSelectMarket={(market) => {
            setShowPortfolioModal(false);
            setModalMarket(market);
          }}
          onBalanceRefresh={fetchBalance}
        />
      )}
    </>
  );
}
