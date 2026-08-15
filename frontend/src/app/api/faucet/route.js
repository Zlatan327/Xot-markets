import { NextResponse } from "next/server";
import { ethers } from "ethers";
import addresses from "../../../lib/addresses.json";
import usdcArtifact from "../../../lib/MockERC20.json";

export async function POST(req) {
  try {
    const body = await req.json();
    const { address: targetAddress } = body;

    if (!targetAddress || !ethers.isAddress(targetAddress)) {
      return NextResponse.json(
        { success: false, error: "Invalid recipient address" },
        { status: 400 }
      );
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { success: false, error: "Server relayer not configured" },
        { status: 500 }
      );
    }

    const rpcUrl = process.env.NEXT_PUBLIC_XLAYER_RPC_URL || "https://testrpc.xlayer.tech";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const relayerWallet = new ethers.Wallet(privateKey, provider);

    // 1. Mint 1,000 USDC to user (sponsored by relayer gas)
    const usdcContract = new ethers.Contract(addresses.usdc, usdcArtifact.abi, relayerWallet);
    const mintAmount = ethers.parseUnits("1000", 18);
    const mintTx = await usdcContract.mint(targetAddress, mintAmount);
    await mintTx.wait();

    // 2. Check if user needs OKB gas stipend for trades (if balance < 0.002 OKB)
    let okbStipendSent = false;
    let okbTxHash = null;
    try {
      const userOkbBal = await provider.getBalance(targetAddress);
      if (userOkbBal < ethers.parseEther("0.002")) {
        const gasGrantTx = await relayerWallet.sendTransaction({
          to: targetAddress,
          value: ethers.parseEther("0.005") // 0.005 OKB is enough for 50+ transactions on X Layer
        });
        await gasGrantTx.wait();
        okbStipendSent = true;
        okbTxHash = gasGrantTx.hash;
      }
    } catch (gasErr) {
      console.warn("Could not dispatch gas stipend:", gasErr);
    }

    return NextResponse.json({
      success: true,
      txHash: mintTx.hash,
      usdcMinted: "1000",
      okbStipendSent,
      okbTxHash
    });
  } catch (error) {
    console.error("Faucet API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.reason || error.message || "Failed to process faucet request"
      },
      { status: 500 }
    );
  }
}
