"use client";
import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

// 1. Get projectId from https://cloud.reown.com
// You should store this in .env.local, but for this demo we'll use a placeholder or hardcoded value if none is provided.
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e464e724a27a2760205b38ed39556'; // Generic placeholder if missing

// 2. Set the networks
const xLayerTestnet = {
  id: 1952,
  name: 'X Layer Testnet',
  currency: 'OKB',
  explorerUrl: 'https://www.oklink.com/x-layer-testnet',
  rpcUrl: process.env.NEXT_PUBLIC_XLAYER_RPC_URL || 'https://testrpc.xlayer.tech/terigon'
};

const networks = [xLayerTestnet];

// 3. Create a metadata object
const metadata = {
  name: 'Xot Markets',
  description: 'Sovereign AI prediction infrastructure.',
  url: 'https://xot.markets', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers Adapter
const ethersAdapter = new EthersAdapter();

// 5. Create AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true
  }
});

export function AppKitProvider({ children }) {
  return (
    <>{children}</>
  );
}
