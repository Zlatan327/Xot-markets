"use client";

import { useState, useEffect } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, ChevronRight, LayoutDashboard, TrendingUp, Trophy, BookOpen, Wallet, Gift, Users, Heart, Sparkles, Settings, User } from 'lucide-react';
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
    <main className="flex h-screen w-full overflow-hidden relative">
      
      {/* Fixed Background Hero */}
      <div className="hero-container">
        <div className="giant-x">X</div>
        <div className="text-ring">
          {[...Array(12)].map((_, i) => (
            <span key={i} style={{ transform: `rotateY(${i * 30}deg) translateZ(250px)` }}>
              AGENT#0x{Math.floor(Math.random() * 4096).toString(16).padStart(3, '0').toUpperCase()}
            </span>
          ))}
        </div>
        
        {/* Floating Boxes */}
        <div className="floating-box" style={{ top: '10%', left: '15%' }}>
          XOT MARKETS
        </div>
        <div className="floating-box vertical-text" style={{ bottom: '10%', right: '10%' }}>
          BUILT ON XLAYER
        </div>
      </div>

      {/* Ultra-Minimal Icon Sidebar */}
      <aside 
        className="flex flex-col h-full w-16 items-center py-6 z-50 shrink-0" 
        style={{ backgroundColor: '#09090b', borderRight: '1px solid #27272a' }}
      >
        <div className="mb-8">
          <Sparkles size={24} color="#3b82f6" fill="#3b82f6" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-8 w-full items-center">
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            <LayoutDashboard size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <TrendingUp size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <Trophy size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <BookOpen size={20} />
          </a>
        </nav>

        <div className="flex flex-col items-center gap-6 mt-auto">
          <button className="text-gray-500 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          
          {wallet ? (
            <button onClick={disconnectWallet} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border-2 border-transparent hover:border-red-500 overflow-hidden" title="Disconnect">
              <User size={16} />
            </button>
          ) : (
            <button onClick={connectWallet} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white hover:bg-blue-500" title="Connect Wallet">
              <Wallet size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Scrollable Content */}
      <section className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
        
        {/* Spacer to push markets below the fold so the fixed hero is visible initially */}
        <div style={{ minHeight: '65vh' }} className="w-full pointer-events-none"></div>

        {/* Markets Section */}
        <div className="p-10 bg-[var(--bg-primary)] min-h-screen border-t-4 border-black" style={{ boxShadow: '0 -20px 40px rgba(0,0,0,0.5)' }}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter bg-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">LIVE MARKETS //</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-black text-xl font-bold">
              <Activity className="animate-spin" /> SYNCING...
            </div>
          ) : (
            <div className="grid grid-cols-auto gap-8 pb-12">
              {markets.map((market, idx) => (
                <MarketCard key={idx} market={market} signerAddress={wallet} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
