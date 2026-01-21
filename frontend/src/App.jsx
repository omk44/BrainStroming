import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Contract Config
const CONTRACT_ADDRESS = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
// Minimal ABI for Frontend
const ABI = [
  "function joinCampaign(string _xHandle) external",
  "function getParticipantCount() external view returns (uint256)",
  "function participants(address) external view returns (bool, bool)" // Note: struct return might need full ABI if complex, but mapping usually returns component-wise in ethers if public. Actually "influencers" mapping is public.
];
// Correct ABI for public mapping "influencers":
// function influencers(address) view returns (address wallet, string xHandle, bool registered, bool paid)

const FULL_ABI = [
  "function joinCampaign(string _xHandle) external",
  "function getParticipantCount() external view returns (uint256)",
  "function influencers(address) view returns (address wallet, string xHandle, bool registered, bool paid)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState("idle"); // idle, joining, success, error
  const [isRegistered, setIsRegistered] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, FULL_ABI, signer);
        setContract(tempContract);

        // Check if already registered
        checkStatus(tempContract, address);

      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const checkStatus = async (contractInstance, userAddress) => {
    try {
      const data = await contractInstance.influencers(userAddress);
      // data is [wallet, xHandle, registered, paid]
      if (data[2] === true) { // registered is index 2
        setIsRegistered(true);
      }
    } catch (err) {
      console.log("Not registered yet or error:", err);
    }
  };

  const handleJoin = async () => {
    if (!contract) return;

    // Auto-fix handle if missing '@'
    let finalHandle = handle.trim();
    if (!finalHandle.startsWith("@")) {
      finalHandle = "@" + finalHandle;
    }

    try {
      setStatus("joining");
      const tx = await contract.joinCampaign(finalHandle);
      await tx.wait();
      setStatus("success");
      setIsRegistered(true);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="glass-panel p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Influencer Nexus</h1>
        <p className="text-slate-400 mb-8">Decentralized Campaign Management</p>

        {!account ? (
          <button onClick={connectWallet} className="btn-primary w-full py-4 text-lg">
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Connected As</span>
              <p className="font-mono text-sm text-blue-400 break-all">{account}</p>
            </div>

            {isRegistered ? (
              <div className="p-6 bg-green-900/30 border border-green-500/30 rounded-lg">
                <h3 className="text-xl font-bold text-green-400 mb-2">🎉 You are participating!</h3>
                <p className="text-slate-300 text-sm">
                  Our backend is now tracking your X engagement.
                  Rewards will be processed automatically when criteria are met.
                </p>
              </div>
            ) : (
              <div className="text-left space-y-4">
                <label className="block text-sm font-medium text-slate-300">Enter your X Handle</label>
                <input
                  type="text"
                  placeholder="@username"
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
                <button
                  onClick={handleJoin}
                  disabled={status === "joining"}
                  className={`w-full btn-primary ${status === "joining" ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {status === "joining" ? "Confirming Transaction..." : "Join Campaign"}
                </button>
                {status === "error" && <p className="text-red-400 text-sm text-center">Transaction Failed. Check console.</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-slate-500 text-xs">
        Running on Sepolia Testnet • Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
      </div>
    </div>
  );
}

export default App;
