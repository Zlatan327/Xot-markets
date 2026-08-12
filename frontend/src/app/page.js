"use client";

import { useState, useEffect } from 'react';
import MarketCard from '../components/MarketCard';
import { Activity, Zap, Shield, ChevronRight, LayoutDashboard, TrendingUp, Trophy, BookOpen, Wallet, Gift, Users, Heart, Sparkles, Settings, User, Bot, Coins, Cpu } from 'lucide-react';
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
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsConnecting(true);
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
              setIsConnecting(false);
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
      setIsConnecting(false);
    } else {
      alert("Please install OKX Wallet or MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setUsdcBalance("0");
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--glow-cyan)] flex items-center justify-center">
            <Sparkles size={14} color="#050505" />
          </div>
          <span className="font-bold text-xl tracking-tight">XOT MARKETS</span>
        </div>
        
        <div className="nav-links hidden md:flex">
          <a href="#" className="nav-link active">Markets</a>
          <a href="https://www.okx.com/web3/marketplace/agents" target="_blank" rel="noreferrer" className="nav-link">Agents</a>
          <a href="https://github.com/agent-odds/contracts" target="_blank" rel="noreferrer" className="nav-link">Specifications</a>
          <a href="https://www.okx.com/web3/build/x-layer" target="_blank" rel="noreferrer" className="nav-link">Docs</a>
        </div>
        
        <div className="flex items-center gap-4">
          {wallet ? (
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-[var(--glow-green)] border border-[var(--glow-green)] px-3 py-1 rounded">
                ${usdcBalance} USDC
              </span>
              <button onClick={disconnectWallet} className="btn-outline flex items-center gap-2 text-red-400 hover:border-red-400 hover:text-red-400 hover:bg-transparent" title="Disconnect Wallet">
                <User size={16} /> {wallet.substring(0, 6)}...{wallet.substring(38)}
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} disabled={isConnecting} className="btn-primary flex items-center gap-2">
              {isConnecting ? <Activity size={16} className="animate-spin" /> : <Wallet size={16} />}
              {isConnecting ? 'CONNECTING...' : 'CONNECT'}
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ marginTop: '5rem' }}>
        
        {/* Split Hero */}
        <section className="hero-split">
          <div className="hero-text">
            <h1>Sovereign AI prediction infrastructure.</h1>
            <p>
              Bespoke execution environments for autonomous agents. Bet on agent performance, yield optimization, and on-chain metrics with zero-latency settlement.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">EXPLORE MARKETS</button>
              <button className="btn-outline">VIEW SPECIFICATIONS</button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="glowing-core">
              {/* Inner glowing elements to simulate a high-tech core */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', textAlign: 'center' }}>
                <Cpu size={48} color="var(--glow-cyan)" />
                <div className="font-mono text-[var(--glow-cyan)] mt-2 text-sm">A2A_CORE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Markets Grid */}
        <section className="mt-8 mb-8">
          <div className="flex justify-between items-center mb-8 border-b border-[var(--border-subtle)] pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} color="var(--glow-blue)" /> LIVE CONTRACTS
            </h2>
            <div className="font-mono text-sm text-[var(--text-muted)]">
              SYSTEM_STATUS: <span style={{ color: 'var(--glow-green)' }}>OPERATIONAL</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12 text-[var(--glow-cyan)] font-mono">
              <Activity className="animate-spin mr-3" /> SYNCHRONIZING NODES...
            </div>
          ) : (
            <div className="grid grid-cols-auto">
              {markets.map((market, idx) => (
                <MarketCard key={idx} market={market} signerAddress={wallet} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
