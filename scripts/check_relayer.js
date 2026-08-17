import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://testrpc.xlayer.tech");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const bal = await provider.getBalance(wallet.address);
  const feeData = await provider.getFeeData();
  console.log("Relayer Address:", wallet.address);
  console.log("Relayer OKB Balance:", ethers.formatEther(bal));
  console.log("Fee Data:", {
    gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : null,
    maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") : null,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") : null,
  });
}

main().catch(console.error);
