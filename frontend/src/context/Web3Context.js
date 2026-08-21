"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { XLAYER_RPC } from '../lib/contracts';

const Web3Context = createContext(null);

export const XLAYER_CHAIN_ID = 1952;
export const XLAYER_CHAIN_ID_HEX = '0x7a0';
const MANUAL_DISCONNECT_KEY = 'xot.wallet.manuallyDisconnected';

export const XLAYER_NETWORK_CONFIG = {
  chainId: XLAYER_CHAIN_ID_HEX,
  chainName: 'X Layer Testnet',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
  rpcUrls: [XLAYER_RPC],
  blockExplorerUrls: ['https://www.oklink.com/x-layer-testnet'],
};

const getInjectedProvider = () => {
  if (typeof window === 'undefined') return null;

  const providers = Array.isArray(window.ethereum?.providers) ? window.ethereum.providers : [];
  const candidates = [
    window.okxwallet?.ethereum,
    providers.find(
      candidate => candidate?.isOkxWallet || candidate?.isOKExWallet,
    ),
    window.ethereum?.isOkxWallet || window.ethereum?.isOKExWallet
      ? window.ethereum
      : null,
    window.okxwallet,
    window.ethereum,
  ];

  return candidates.find(candidate => typeof candidate?.request === 'function') || null;
};

export function Web3Provider({ children }) {
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isConnected = !!address;
  const isCorrectNetwork = Number(chainId) === XLAYER_CHAIN_ID;

  // Initialize public provider
  const getPublicProvider = useCallback(() => {
    return new ethers.JsonRpcProvider(XLAYER_RPC);
  }, []);

  const sendWalletTransaction = useCallback(async ({ to, data, value = 0n, gasLimit }) => {
    if (!walletProvider || !address) {
      throw new Error('Wallet is not connected');
    }
    if (!isCorrectNetwork) {
      throw new Error(`Wallet must be connected to X Layer Testnet (Chain ID ${XLAYER_CHAIN_ID})`);
    }

    const publicProvider = getPublicProvider();
    const transaction = {
      from: address,
      to: ethers.getAddress(to),
      data,
      value,
    };

    const [nonce, feeData, estimatedGas] = await Promise.all([
      publicProvider.getTransactionCount(address, 'pending'),
      publicProvider.getFeeData(),
      gasLimit == null ? publicProvider.estimateGas(transaction) : Promise.resolve(BigInt(gasLimit)),
    ]);

    const request = {
      from: address,
      to: transaction.to,
      data,
      value: ethers.toQuantity(value),
      gas: ethers.toQuantity(gasLimit == null ? (estimatedGas * 120n) / 100n : estimatedGas),
      nonce: ethers.toQuantity(nonce),
    };
    if (feeData.gasPrice != null) {
      request.gasPrice = ethers.toQuantity(feeData.gasPrice);
    }

    const hash = await walletProvider.request({ method: 'eth_sendTransaction', params: [request] });

    return {
      hash,
      wait: (confirmations = 1) => publicProvider.waitForTransaction(hash, confirmations),
    };
  }, [address, getPublicProvider, isCorrectNetwork, walletProvider]);

  // Switch or Add X Layer Network
  const switchToXLayer = async () => {
    const providerObj = getInjectedProvider();
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
    const injectedProvider = getInjectedProvider();
    
    if (!injectedProvider) {
      alert('No Web3 wallet found! Please install MetaMask or OKX Web3 Wallet.');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      sessionStorage.removeItem(MANUAL_DISCONNECT_KEY);
      let browserProvider = new ethers.BrowserProvider(injectedProvider);
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected');
      }

      // 2. Check network
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      if (currentChainId !== XLAYER_CHAIN_ID) {
        const switched = await switchToXLayer();
        if (!switched) {
          setError(`Please switch your wallet to X Layer Testnet (Chain ID ${XLAYER_CHAIN_ID})`);
          return;
        }
        browserProvider = new ethers.BrowserProvider(injectedProvider);
        setChainId(XLAYER_CHAIN_ID);
      }

      // 3. Set signer & provider
      const userSigner = await browserProvider.getSigner();
      const userAddress = await userSigner.getAddress();

      setAddress(userAddress);
      setSigner(userSigner);
      setProvider(browserProvider);
      setWalletProvider(injectedProvider);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    sessionStorage.setItem(MANUAL_DISCONNECT_KEY, 'true');
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setWalletProvider(null);
    setChainId(null);
    setError(null);
  };

  // Listen for account / chain changes
  useEffect(() => {
    const injectedProvider = getInjectedProvider();
    if (!injectedProvider) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (sessionStorage.getItem(MANUAL_DISCONNECT_KEY) !== 'true') {
        const browserProvider = new ethers.BrowserProvider(injectedProvider);
        const userSigner = await browserProvider.getSigner();
        setAddress(accounts[0]);
        setSigner(userSigner);
        setProvider(browserProvider);
        setWalletProvider(injectedProvider);
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
      if (sessionStorage.getItem(MANUAL_DISCONNECT_KEY) === 'true') return;
      if (accounts && accounts.length > 0) {
        try {
          const browserProvider = new ethers.BrowserProvider(injectedProvider);
          const network = await browserProvider.getNetwork();
          setChainId(Number(network.chainId));
          const userSigner = await browserProvider.getSigner();
          setAddress(accounts[0]);
          setSigner(userSigner);
          setProvider(browserProvider);
          setWalletProvider(injectedProvider);
        } catch (e) {
          console.debug('Auto-connect check skipped:', e);
        }
      }
    }).catch(() => {});

    return () => {
      injectedProvider.removeListener?.('accountsChanged', handleAccountsChanged);
      injectedProvider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        address,
        signer,
        provider,
        walletProvider,
        chainId,
        isConnected,
        isCorrectNetwork,
        connecting,
        error,
        connectWallet,
        disconnectWallet,
        switchToXLayer,
        getPublicProvider,
        sendWalletTransaction,
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
