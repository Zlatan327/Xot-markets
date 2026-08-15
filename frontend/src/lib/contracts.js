import { ethers } from "ethers";
import addresses from "./addresses.json";
import factoryArtifact from "./MarketFactory.json";
import marketArtifact from "./BinaryMarket.json";
import usdcArtifact from "./MockERC20.json";

export const XLAYER_RPC = "https://testrpc.xlayer.tech";

export const getPublicProvider = () => {
  return new ethers.JsonRpcProvider(XLAYER_RPC);
};

export const getProvider = (walletProvider) => {
  if (walletProvider) {
    return new ethers.BrowserProvider(walletProvider);
  }
  return getPublicProvider();
};

export const getContracts = async (signerOrProvider) => {
  const provider = signerOrProvider || getPublicProvider();
  const factory = new ethers.Contract(addresses.factory, factoryArtifact.abi, provider);
  const usdc = new ethers.Contract(addresses.usdc, usdcArtifact.abi, provider);
  return { factory, usdc, addresses, marketAbi: marketArtifact.abi };
};

