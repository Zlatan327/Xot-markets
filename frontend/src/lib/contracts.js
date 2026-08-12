import { ethers } from "ethers";
import addresses from "./addresses.json";
import factoryArtifact from "./MarketFactory.json";
import marketArtifact from "./BinaryMarket.json";
import usdcArtifact from "./MockERC20.json";

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider("https://testrpc.xlayer.tech");
};

export const getContracts = async (signerOrProvider) => {
  const factory = new ethers.Contract(addresses.factory, factoryArtifact.abi, signerOrProvider);
  const usdc = new ethers.Contract(addresses.usdc, usdcArtifact.abi, signerOrProvider);
  return { factory, usdc, addresses, marketAbi: marketArtifact.abi };
};
