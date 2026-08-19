"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { XLAYER_RPC } from '../lib/contracts';

const Web3Context = createContext(null);

export const XLAYER_CHAIN_ID = 195;
export const XLAYER_CHAIN_ID_HEX = '0xc3';

export const XLAYER_NETWORK_CONFIG = {
  chainId: XLAYER_CHAIN_ID_HEX,
  chainName: 'X Layer Testnet',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
  rpcUrls: ['https://testrpc.xlayer.tech'],
  blockExplorerUrls: ['https://www.okx.com/explorer/xlayer-test'],
};

export function Web3Provider({ children }) {
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isConnected = !!address;
  const isCorrectNetwork = Number(chainId) === XLAYER_CHAIN_ID;

  // Initialize public provider
  const getPublicProvider = useCallback(() => {
    return new ethers.JsonRpcProvider(XLAYER_RPC);
  }, []);

  // Switch or Add X Layer Network
  const switchToXLayer = async (providerObj) => {
    if (typeof window === 'undefined' || !providerObj) return false;
    try {
      await providerObj.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: XLAYER_CHAIN_ID_HEX }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          await providerObj.request({
            method: 'wallet_addEthereumChain',
            params: [XLAYER_NETWORK_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add X Layer Testnet:', addError);
          return false;
        }
      }
      return false;
    }
  };

  // Connect Wallet
  const connectWallet = async () => {
    const injectedProvider = typeof window !== 'undefined' ? (window.ethereum || window.okxwallet) : null;
    
    if (!injectedProvider) {
      alert('No Web3 wallet found! Please install MetaMask or OKX Web3 Wallet.');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      const browserProvider = new ethers.BrowserProvider(injectedProvider);
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected');
      }

      // 2. Check network
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      if (currentChainId !== XLAYER_CHAIN_ID) {
        const switched = await switchToXLayer(injectedProvider);
        if (!switched) {
          setError('Please switch your wallet to X Layer Testnet (Chain ID 195)');
        }
      }

      // 3. Set signer & provider
      const userSigner = await browserProvider.getSigner();
      const userAddress = await userSigner.getAddress();

      setAddress(userAddress);
      setSigner(userSigner);
      setProvider(browserProvider);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setChainId(null);
    setError(null);
  };

  // Listen for account / chain changes
  useEffect(() => {
    const injectedProvider = typeof window !== 'undefined' ? (window.ethereum || window.okxwallet) : null;
    if (!injectedProvider) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (address && accounts[0].toLowerCase() !== address.toLowerCase()) {
        const browserProvider = new ethers.BrowserProvider(injectedProvider);
        const userSigner = await browserProvider.getSigner();
        setAddress(accounts[0]);
        setSigner(userSigner);
        setProvider(browserProvider);
      }
    };

    const handleChainChanged = (newChainIdHex) => {
      const newChainId = parseInt(newChainIdHex, 16);
      setChainId(newChainId);
      window.location.reload();
    };

    injectedProvider.on?.('accountsChanged', handleAccountsChanged);
    injectedProvider.on?.('chainChanged', handleChainChanged);

    // Check if already authorized
    injectedProvider.request?.({ method: 'eth_accounts' }).then(async (accounts) => {
      if (accounts && accounts.length > 0) {
        try {
          const browserProvider = new ethers.BrowserProvider(injectedProvider);
          const network = await browserProvider.getNetwork();
          setChainId(Number(network.chainId));
          const userSigner = await browserProvider.getSigner();
          setAddress(accounts[0]);
          setSigner(userSigner);
          setProvider(browserProvider);
        } catch (e) {
          console.debug('Auto-connect check skipped:', e);
        }
      }
    }).catch(() => {});

    return () => {
      injectedProvider.removeListener?.('accountsChanged', handleAccountsChanged);
      injectedProvider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [address]);

  return (
    <Web3Context.Provider
      value={{
        address,
        signer,
        provider,
        chainId,
        isConnected,
        isCorrectNetwork,
        connecting,
        error,
        connectWallet,
        disconnectWallet,
        switchToXLayer,
        getPublicProvider,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
