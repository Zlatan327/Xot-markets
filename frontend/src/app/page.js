"use client";

import { useState, useEffect } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, ChevronRight, LayoutDashboard, TrendingUp, Trophy, BookOpen, Wallet, Gift, Users, Heart } from 'lucide-react';
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
          const outcome = await marketContract.finalOutcome();
          
          liveMarkets.push({
            id: address,
            marketAddress: address,
            agentName: "Agent " + agent.substring(0, 6),
            metric: metricType == 1 ? `Volume > ${Number(threshold).toLocaleString()}` : metricType == 2 ? `APY > ${Number(threshold)}%` : `Executions > ${Number(threshold)}`,
            poolYes: Number(ethers.formatEther(totalYes)),
            poolNo: Number(ethers.formatEther(totalNo)),
            outcome: Number(outcome),
            expiresIn: Number(outcome) === 0 ? "Live" : "Ended"
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

  const [usdcBalance, setUsdcBalance] = useState("0");

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
        
        // Ensure connected to X Layer Testnet (Chain ID: 195 or 0xc3)
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xc3') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xc3' }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xc3',
                  chainName: 'X Layer Testnet',
                  rpcUrls: ['https://testrpc.xlayer.tech'],
                  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
                  blockExplorerUrls: ['https://www.okx.com/explorer/xlayer-test']
                }],
              });
            } else {
              console.error(switchError);
              alert("Please switch to X Layer Testnet to use this dApp.");
              return;
            }
          }
        }
        
        // Fetch USDC Balance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const { usdc } = await getContracts(signer);
        const bal = await usdc.balanceOf(accounts[0]);
        setUsdcBalance(Number(ethers.formatEther(bal)).toFixed(2));
        
      } catch (e) {
        console.error("User rejected connection", e);
      }
    } else {
      alert("Please install OKX Wallet or MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setUsdcBalance("0");
  };

  return (
    <main className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col h-full" style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-glass)' }}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <Zap size={28} color="var(--accent-primary)" />
          <span className="text-2xl font-bold tracking-tight">dazzardo<span style={{color: 'var(--accent-primary)'}}>.</span></span>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: '#000' }}>
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-secondary hover:text-white transition-colors">
            <TrendingUp size={20} /> Markets
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-secondary hover:text-white transition-colors">
            <Trophy size={20} /> Leaderboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-secondary hover:text-white transition-colors">
            <Gift size={20} /> Gifts
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-secondary hover:text-white transition-colors">
            <Users size={20} /> Affiliates
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-secondary hover:text-white transition-colors">
            <BookOpen size={20} /> Docs
          </a>
        </nav>

        {/* Personal Hub */}
        <div className="p-4 mt-auto">
          <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'var(--gradient-hub)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={18} className="text-white" />
              <span className="font-bold text-white text-sm">Personal Hub</span>
            </div>
            
            {wallet ? (
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-between items-center text-white/80 text-xs">
                  <span>Balance</span>
                  <span className="font-bold text-white">{usdcBalance} USDC</span>
                </div>
                <button 
                  onClick={disconnectWallet}
                  className="w-full py-2 mt-2 rounded-lg text-xs font-bold text-white/90 bg-black/20 hover:bg-black/40 transition-colors"
                >
                  {wallet.substring(0, 6)}...{wallet.substring(38)} (Disconnect)
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-white/80 text-xs mb-3">Connect wallet to trade on X Layer.</p>
                <button 
                  onClick={connectWallet}
                  className="w-full py-2 bg-white text-black font-bold text-sm rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col h-full overflow-y-auto p-8 relative">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Overall</h1>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2 text-secondary font-medium">
              <Heart size={16} color="var(--danger)" /> Total Volume
            </div>
            <div className="text-3xl font-bold text-white">
              $1.2M
            </div>
            <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-md" style={{ background: 'linear-gradient(90deg, var(--danger), var(--accent-primary))' }}></div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-secondary font-medium">
              <Activity size={16} color="var(--accent-secondary)" /> Markets Active
            </div>
            <div className="text-3xl font-bold text-white">
              {markets.length}
            </div>
            <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-md" style={{ background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-tertiary))' }}></div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--accent-secondary)', border: 'none' }}>
            <div className="flex items-center gap-2 mb-2 text-black/70 font-medium">
              <Trophy size={16} /> Total Users
            </div>
            <div className="text-3xl font-bold text-black">
              149
            </div>
          </div>

          <div className="p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--accent-primary)', border: 'none' }}>
            <div className="text-4xl font-black text-black mb-1">
              345k
            </div>
            <div className="text-sm font-bold text-black/80 mb-4">Total Trades</div>
            <div className="text-xs text-black/60">Across all AI agents</div>
            <svg className="absolute bottom-2 right-2 w-24 h-12 opacity-50" viewBox="0 0 100 50">
              <path d="M0 40 Q 25 30, 50 40 T 100 20 L 100 50 L 0 50 Z" fill="rgba(0,0,0,0.2)"/>
            </svg>
          </div>
        </div>

        {/* Markets Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-secondary uppercase tracking-widest mb-4">LIVE MARKETS</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-secondary text-lg">
            <Activity className="animate-spin" /> Syncing with X Layer...
          </div>
        ) : (
          <div className="grid grid-cols-auto gap-6 pb-12">
            {markets.map((market, idx) => (
              <MarketCard key={idx} market={market} signerAddress={wallet} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
