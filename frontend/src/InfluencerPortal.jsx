import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Update these after deployment
const FACTORY_ADDRESS = "0x761AeCcCfd8d847139468E8C60B02D0db2530AbA";

const FACTORY_ABI = [
    "function allCampaigns(uint256) external view returns (address)",
    "function getTotalCampaigns() external view returns (uint256)"
];

const CAMPAIGN_ABI = [
    "function joinCampaign(string _xHandle) external",
    "function getCampaignInfo() external view returns (address owner, uint256 budget, uint256 participants, uint256 maxParticipants, uint256 reward)",
    "function influencers(address) external view returns (address wallet, string xHandle, bool registered, bool paid)"
];

function InfluencerPortal() {
    const [account, setAccount] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [xHandle, setXHandle] = useState('');
    const [userStatus, setUserStatus] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);

                await loadAllCampaigns();
            } catch (err) {
                console.error("Wallet connection failed:", err);
                alert("Failed to connect wallet");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const loadAllCampaigns = async () => {
        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

            const totalCampaigns = await factory.getTotalCampaigns();
            const campaignList = [];

            for (let i = 0; i < Number(totalCampaigns); i++) {
                const campaignAddr = await factory.allCampaigns(i);
                const campaign = new ethers.Contract(campaignAddr, CAMPAIGN_ABI, provider);
                const info = await campaign.getCampaignInfo();

                // Only show campaigns that aren't full
                if (Number(info[2]) < Number(info[3])) {
                    campaignList.push({
                        address: campaignAddr,
                        owner: info[0],
                        budget: ethers.formatEther(info[1]),
                        participants: Number(info[2]),
                        maxParticipants: Number(info[3]),
                        rewardPerInfluencer: ethers.formatEther(info[4])
                    });
                }
            }

            setCampaigns(campaignList);
        } catch (err) {
            console.error("Failed to load campaigns:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkUserStatus = async (campaignAddress) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const campaign = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, provider);
            const status = await campaign.influencers(account);

            setUserStatus({
                registered: status[2],
                paid: status[3],
                xHandle: status[1]
            });
        } catch (err) {
            console.error("Failed to check status:", err);
            setUserStatus(null);
        }
    };

    const handleJoinCampaign = async (e) => {
        e.preventDefault();

        if (!selectedCampaign) return;

        try {
            setLoading(true);

            // Auto-prepend @ if missing
            let finalHandle = xHandle.trim();
            if (!finalHandle.startsWith('@')) {
                finalHandle = '@' + finalHandle;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const campaign = new ethers.Contract(selectedCampaign.address, CAMPAIGN_ABI, signer);

            const tx = await campaign.joinCampaign(finalHandle);
            await tx.wait();

            alert("Successfully joined campaign!");
            setXHandle('');
            setSelectedCampaign(null);

            await loadAllCampaigns();
            await checkUserStatus(selectedCampaign.address);

        } catch (err) {
            console.error("Failed to join campaign:", err);
            alert("Failed to join: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCampaign && account) {
            checkUserStatus(selectedCampaign.address);
        }
    }, [selectedCampaign, account]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 text-white p-6">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold gradient-text mb-2">Influencer Portal</h1>
                    <p className="text-slate-400">Browse and join active campaigns</p>
                </div>

                {/* Connect Wallet */}
                {!account ? (
                    <div className="glass-panel p-12 text-center max-w-md mx-auto">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                            <p className="text-slate-400 mb-6">Connect to browse and join campaigns</p>
                        </div>
                        <button onClick={connectWallet} className="btn-primary w-full py-4 text-lg">
                            Connect MetaMask
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Account Info */}
                        <div className="glass-panel p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Connected Account</p>
                                    <p className="font-mono text-pink-400">{account.slice(0, 6)}...{account.slice(-4)}</p>
                                </div>
                                <button
                                    onClick={loadAllCampaigns}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition"
                                >
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>

                        {/* Campaigns Grid */}
                        <div className="glass-panel p-8">
                            <h2 className="text-2xl font-bold mb-6">Active Campaigns ({campaigns.length})</h2>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                                    <p className="text-slate-400 mt-4">Loading campaigns...</p>
                                </div>
                            ) : campaigns.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 text-lg">No active campaigns available</p>
                                    <p className="text-slate-500 text-sm mt-2">Check back later for new opportunities</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {campaigns.map((campaign, index) => (
                                        <div
                                            key={campaign.address}
                                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-pink-500 transition cursor-pointer"
                                            onClick={() => setSelectedCampaign(campaign)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-bold text-pink-400">Campaign #{index + 1}</h3>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
                                                    Open
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div>
                                                    <p className="text-xs text-slate-400">Reward Per Influencer</p>
                                                    <p className="text-2xl font-bold text-pink-400">{parseFloat(campaign.rewardPerInfluencer).toFixed(4)} ETH</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="text-xs text-slate-400">Spots Left</p>
                                                        <p className="text-lg font-bold">{campaign.maxParticipants - campaign.participants}/{campaign.maxParticipants}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Total Budget</p>
                                                        <p className="text-lg font-bold">{parseFloat(campaign.budget).toFixed(2)} ETH</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="w-full btn-primary py-2 text-sm">
                                                View Details →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Join Campaign Modal */}
                        {selectedCampaign && (
                            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCampaign(null)}>
                                <div className="glass-panel p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                                    <h2 className="text-2xl font-bold mb-6">Join Campaign</h2>

                                    {userStatus?.registered ? (
                                        <div className="p-6 bg-green-900/30 border border-green-500/30 rounded-lg text-center">
                                            <h3 className="text-xl font-bold text-green-400 mb-2">🎉 You're Participating!</h3>
                                            <p className="text-slate-300 mb-2">X Handle: {userStatus.xHandle}</p>
                                            <p className="text-sm text-slate-400">
                                                {userStatus.paid ? "✅ Reward paid" : "⏳ Pending verification"}
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleJoinCampaign} className="space-y-6">
                                            <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Reward:</span>
                                                    <span className="font-bold text-pink-400">{parseFloat(selectedCampaign.rewardPerInfluencer).toFixed(4)} ETH</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Spots Left:</span>
                                                    <span className="font-bold">{selectedCampaign.maxParticipants - selectedCampaign.participants}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Your X (Twitter) Handle
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={xHandle}
                                                    onChange={(e) => setXHandle(e.target.value)}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                    placeholder="username or @username"
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="btn-primary flex-1 py-3"
                                                >
                                                    {loading ? 'Joining...' : 'Join Campaign'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCampaign(null)}
                                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-md transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default InfluencerPortal;
