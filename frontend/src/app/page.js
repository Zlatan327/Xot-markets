"use client";

import { useState, useEffect } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, ChevronRight, LayoutDashboard, TrendingUp, Trophy, BookOpen, Wallet, Gift, Users, Heart, Menu, X as XIcon } from 'lucide-react';
import { getProvider, getContracts } from '../lib/contracts';
import { ethers } from 'ethers';

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <main className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`flex flex-col h-full transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`} 
        style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '2px solid var(--accent-secondary)' }}
      >
        <div className="p-6 flex items-center gap-3 mb-6" style={{ minWidth: '16rem' }}>
          <Zap size={28} color="white" />
          <span className="text-2xl font-bold tracking-tight text-white">XotMarkets.</span>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2" style={{ minWidth: '16rem' }}>
          <a href="#" className="flex items-center gap-3 px-4 py-3 font-bold bg-white text-black border-2 border-black">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 font-medium text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors">
            <TrendingUp size={20} /> Markets
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 font-medium text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors">
            <Trophy size={20} /> Leaderboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 font-medium text-white hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-colors">
            <BookOpen size={20} /> Docs
          </a>
        </nav>

        {/* Personal Hub */}
        <div className="p-4 mt-auto" style={{ minWidth: '16rem' }}>
          <div className="p-5 border-2 border-white" style={{ background: 'var(--gradient-hub)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={18} className="text-white" />
              <span className="font-bold text-white text-sm uppercase">Wallet</span>
            </div>
            
            {wallet ? (
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-between items-center text-white text-xs">
                  <span>BAL</span>
                  <span className="font-bold">{usdcBalance} USDC</span>
                </div>
                <button 
                  onClick={disconnectWallet}
                  className="w-full py-2 mt-2 text-xs font-bold text-white border border-white hover:bg-white hover:text-black transition-colors uppercase"
                >
                  {wallet.substring(0, 6)}...{wallet.substring(38)} [X]
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <button 
                  onClick={connectWallet}
                  className="w-full py-2 bg-white text-black font-bold text-sm border-2 border-black hover:bg-black hover:text-white transition-all uppercase"
                >
                  Connect
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[var(--bg-primary)]">
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="absolute top-6 left-6 z-50 p-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
        >
          {isSidebarOpen ? <XIcon size={24} /> : <Menu size={24} />}
        </button>

        {/* Hero Section */}
        <div className="hero-container relative w-full border-b-2 border-black" style={{ minHeight: '60vh' }}>
          <div className="giant-x">X</div>
          <div className="text-ring">
            {[...Array(12)].map((_, i) => (
              <span key={i} style={{ transform: `rotateY(${i * 30}deg) translateZ(400px)` }}>
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

        {/* Markets Section */}
        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter">LIVE MARKETS //</h2>
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
