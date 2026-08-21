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
  const { address, isConnected, isCorrectNetwork, connectWallet, disconnectWallet, switchToXLayer, connecting, signer, sendWalletTransaction } = useWeb3();
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
      const tx = await sendWalletTransaction({
        to: await usdc.getAddress(),
        data: usdc.interface.encodeFunctionData("mint", [address, amount]),
      });
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
      {/* Top Navigation Bar (Clean Google/Linear Styled) */}
      <nav className="top-nav" style={{ padding: '0.75rem 2rem' }}>
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Logo size={26} />
          <span style={{ fontWeight: '800', fontSize: '16px', letterSpacing: '-0.02em', color: '#f0f6fc' }}>
            XOT MARKETS
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8'
          }}>
            X Layer
          </span>
        </div>

        {/* Center: Clean Navigation Links */}
        <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#markets-section" style={{ color: '#f0f6fc', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>
            Markets
          </a>
          <button 
            onClick={() => setShowAgentsModal(true)} 
            style={{ background: 'none', border: 'none', color: '#8b949e', fontWeight: '600', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f0f6fc'}
            onMouseOut={(e) => e.currentTarget.style.color = '#8b949e'}
          >
            Agents Directory
          </button>
          <button 
            onClick={() => {
              if (!isConnected) connectWallet();
              else setShowPortfolioModal(true);
            }} 
            style={{ background: 'none', border: 'none', color: '#8b949e', fontWeight: '600', fontSize: '13px', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f0f6fc'}
            onMouseOut={(e) => e.currentTarget.style.color = '#8b949e'}
          >
            Portfolio
          </button>
          <button 
            onClick={() => setShowDocsModal(true)} 
            style={{ background: 'none', border: 'none', color: '#8b949e', fontWeight: '600', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            onMouseOver={(e) => e.currentTarget.style.color = '#f0f6fc'}
            onMouseOut={(e) => e.currentTarget.style.color = '#8b949e'}
          >
            Docs & Contracts
          </button>
        </div>

        {/* Right: Unified Account Capsule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isConnected && address ? (
            !isCorrectNetwork ? (
              <button 
                onClick={switchToXLayer}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <AlertTriangle size={13} /> Switch to X Layer
              </button>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '24px',
                padding: '4px 6px 4px 12px'
              }}>
                {/* Balance */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', fontSize: '12px' }}>
                  <span style={{ color: '#8b949e', fontSize: '10px', fontWeight: '700' }}>USDC</span>
                  <span style={{ color: '#39d353', fontWeight: '800', fontFamily: 'monospace' }}>${usdcBalance}</span>
                </div>

                {/* Compact Faucet Pill */}
                <FaucetButton signerAddress={address} onBalanceRefresh={fetchBalance} />

                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '14px', background: '#30363d' }} />

                {/* Address & Green Network Dot */}
                <div 
                  onClick={() => setShowPortfolioModal(true)}
                  title="Open Portfolio & Active Positions"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f0f6fc', fontWeight: '600', cursor: 'pointer', padding: '2px 4px' }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#39d353' }} />
                  <span style={{ fontFamily: 'monospace' }}>{formatAddress(address)}</span>
                </div>

                {/* Disconnect Button */}
                <button 
                  onClick={disconnectWallet}
                  title="Disconnect Wallet"
                  style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#f85149'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#8b949e'}
                >
                  <LogOut size={13} />
                </button>
              </div>
            )
          ) : (
            <button 
              onClick={connectWallet}
              disabled={connecting}
              style={{
                background: '#f0f6fc',
                color: '#0d1117',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#ffffff'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f0f6fc'}
            >
              <Wallet size={14} />
              <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ marginTop: '4.5rem' }}>
        
        {/* 3D Fintech Animation Hero */}
        <Hero3D
          totalTvl={totalTvl}
          activeAgentsCount={activeAgentsCount || 8}
          markets={markets}
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
          
          {/* Main Controls & Search Bar (Roomy Google Workspace Style) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '20px',
            background: '#0d1117',
            padding: '16px 20px',
            border: '1px solid #21262d',
            borderRadius: '12px'
          }}>
            {/* Top Bar: Search + Status Filters + Sort + View Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              
              {/* Roomy Search Input */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '8px 14px',
                gap: '10px',
                flex: '1',
                maxWidth: '440px',
                minWidth: '260px'
              }}>
                <Search size={15} color="#8b949e" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search 21 agents, market metrics, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    outline: 'none',
                    width: '100%'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                  >
                    ✕
                  </button>
                )}
                <span style={{
                  fontSize: '11px',
                  color: '#8b949e',
                  background: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  padding: '1px 6px',
                  fontFamily: 'monospace'
                }}>
                  /
                </span>
              </div>

              {/* Status Tabs, Sort, and View Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', gap: '4px', background: '#161b22', padding: '3px', borderRadius: '8px', border: '1px solid #30363d' }}>
                  {[
                    { id: "ALL", label: `All (${markets.length})` },
                    { id: "LIVE", label: `Live (${markets.filter(m => m.outcome === 0).length})` },
                    { id: "RESOLVED", label: `Resolved (${markets.filter(m => m.outcome !== 0).length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      style={{
                        background: statusFilter === tab.id ? '#21262d' : 'transparent',
                        border: 'none',
                        color: statusFilter === tab.id ? '#58a6ff' : '#8b949e',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
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
                    <option value="LIQUIDITY_DESC">Highest Pool</option>
                    <option value="EXPIRY_ASC">Ending Soonest</option>
                    <option value="ODDS_DESC">Highest YES Odds</option>
                    <option value="ODDS_ASC">Lowest YES Odds</option>
                  </select>
                </div>

                {/* View Switcher (Grid vs Table) */}
                <div style={{ display: 'flex', background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                  <button
                    onClick={() => setViewMode("GRID")}
                    style={{
                      background: viewMode === "GRID" ? '#21262d' : 'transparent',
                      border: 'none',
                      color: viewMode === "GRID" ? '#58a6ff' : '#8b949e',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '700'
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
                      color: viewMode === "TABLE" ? '#58a6ff' : '#8b949e',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                    title="Dense Table View"
                  >
                    <List size={13} /> Table
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Category Navigation Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', borderTop: '1px solid #21262d', paddingTop: '12px' }}>
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
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
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
