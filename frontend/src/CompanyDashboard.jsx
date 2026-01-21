import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Factory Contract Configuration
const FACTORY_ADDRESS = "0x761AeCcCfd8d847139468E8C60B02D0db2530AbA"; // Update after deployment

const FACTORY_ABI = [
    "function createCampaign(uint256 _maxInfluencers, address _backendVerifier) external payable returns (address)",
    "function getCompanyCampaigns(address _company) external view returns (address[])",
    "function getTotalCampaigns() external view returns (uint256)",
    "function platformFeePercent() external view returns (uint256)",
    "event CampaignCreated(address indexed campaignAddress, address indexed companyAdmin, uint256 totalBudget, uint256 platformFee, uint256 campaignBudget)"
];

const CAMPAIGN_ABI = [
    "function getCampaignInfo() external view returns (address owner, uint256 budget, uint256 participants, uint256 maxParticipants, uint256 reward)",
    "function brandOwner() external view returns (address)",
    "function participantCount() external view returns (uint256)",
    "function maxInfluencers() external view returns (uint256)"
];

function CompanyDashboard() {
    const [account, setAccount] = useState(null);
    const [factoryContract, setFactoryContract] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [platformFee, setPlatformFee] = useState(5);
    const [loading, setLoading] = useState(false);

    // Form state
    const [budget, setBudget] = useState('');
    const [maxInfluencers, setMaxInfluencers] = useState('10');
    const [backendWallet, setBackendWallet] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Connect wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);

                const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
                setFactoryContract(factory);

                // Get platform fee
                const fee = await factory.platformFeePercent();
                setPlatformFee(Number(fee));

                // Load user's campaigns
                await loadCampaigns(factory, address);
            } catch (err) {
                console.error("Wallet connection failed:", err);
                alert("Failed to connect wallet");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    // Load all campaigns for this company
    const loadCampaigns = async (factory, companyAddress) => {
        try {
            setLoading(true);
            const campaignAddresses = await factory.getCompanyCampaigns(companyAddress);

            const campaignDetails = await Promise.all(
                campaignAddresses.map(async (addr) => {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const campaign = new ethers.Contract(addr, CAMPAIGN_ABI, provider);
                    const info = await campaign.getCampaignInfo();

                    return {
                        address: addr,
                        owner: info[0],
                        budget: ethers.formatEther(info[1]),
                        participants: Number(info[2]),
                        maxParticipants: Number(info[3]),
                        rewardPerInfluencer: ethers.formatEther(info[4])
                    };
                })
            );

            setCampaigns(campaignDetails);
        } catch (err) {
            console.error("Failed to load campaigns:", err);
        } finally {
            setLoading(false);
        }
    };

    // Create new campaign
    const handleCreateCampaign = async (e) => {
        e.preventDefault();

        if (!factoryContract) return;

        try {
            setLoading(true);

            const budgetWei = ethers.parseEther(budget);
            const platformFeeAmount = (parseFloat(budget) * platformFee) / 100;
            const campaignBudget = parseFloat(budget) - platformFeeAmount;

            // Confirm with user
            const confirmed = window.confirm(
                `Create Campaign?\n\n` +
                `Total Budget: ${budget} ETH\n` +
                `Platform Fee (${platformFee}%): ${platformFeeAmount.toFixed(4)} ETH\n` +
                `Campaign Budget: ${campaignBudget.toFixed(4)} ETH\n` +
                `Max Influencers: ${maxInfluencers}\n` +
                `Reward Each: ${(campaignBudget / parseInt(maxInfluencers)).toFixed(4)} ETH`
            );

            if (!confirmed) {
                setLoading(false);
                return;
            }

            const tx = await factoryContract.createCampaign(
                parseInt(maxInfluencers),
                backendWallet,
                { value: budgetWei }
            );

            await tx.wait();

            alert("Campaign created successfully!");
            setShowCreateForm(false);
            setBudget('');
            setMaxInfluencers('10');

            // Reload campaigns
            await loadCampaigns(factoryContract, account);

        } catch (err) {
            console.error("Campaign creation failed:", err);
            alert("Failed to create campaign: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold gradient-text mb-2">Company Dashboard</h1>
                    <p className="text-slate-400">Create and manage your influencer campaigns</p>
                </div>

                {/* Connect Wallet */}
                {!account ? (
                    <div className="glass-panel p-12 text-center max-w-md mx-auto">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                            <p className="text-slate-400 mb-6">Connect to create and manage campaigns</p>
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
                                    <p className="font-mono text-blue-400">{account.slice(0, 6)}...{account.slice(-4)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400 mb-1">Platform Fee</p>
                                    <p className="text-2xl font-bold text-purple-400">{platformFee}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Create Campaign Button */}
                        {!showCreateForm && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn-primary mb-6 px-8 py-4 text-lg"
                            >
                                + Create New Campaign
                            </button>
                        )}

                        {/* Create Campaign Form */}
                        {showCreateForm && (
                            <div className="glass-panel p-8 mb-6">
                                <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
                                <form onSubmit={handleCreateCampaign} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Total Budget (ETH)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.001"
                                            min="0.001"
                                            required
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="1.0"
                                        />
                                        {budget && (
                                            <p className="text-sm text-slate-400 mt-2">
                                                Platform fee: {((parseFloat(budget) * platformFee) / 100).toFixed(4)} ETH •
                                                Campaign budget: {(parseFloat(budget) - (parseFloat(budget) * platformFee) / 100).toFixed(4)} ETH
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Maximum Influencers
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            required
                                            value={maxInfluencers}
                                            onChange={(e) => setMaxInfluencers(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {budget && maxInfluencers && (
                                            <p className="text-sm text-slate-400 mt-2">
                                                Reward per influencer: {((parseFloat(budget) - (parseFloat(budget) * platformFee) / 100) / parseInt(maxInfluencers)).toFixed(4)} ETH
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Backend Verifier Wallet
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={backendWallet}
                                            onChange={(e) => setBackendWallet(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="0x..."
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Wallet authorized to trigger payments
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary flex-1 py-3"
                                        >
                                            {loading ? 'Creating...' : 'Create Campaign'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateForm(false)}
                                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-md transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Campaigns List */}
                        <div className="glass-panel p-8">
                            <h2 className="text-2xl font-bold mb-6">Your Campaigns ({campaigns.length})</h2>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                    <p className="text-slate-400 mt-4">Loading campaigns...</p>
                                </div>
                            ) : campaigns.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 text-lg">No campaigns yet</p>
                                    <p className="text-slate-500 text-sm mt-2">Create your first campaign to get started</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {campaigns.map((campaign, index) => (
                                        <div key={campaign.address} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-purple-400">Campaign #{index + 1}</h3>
                                                    <p className="text-xs font-mono text-slate-500 mt-1">{campaign.address}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.participants < campaign.maxParticipants
                                                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                                                        : 'bg-red-900/30 text-red-400 border border-red-500/30'
                                                    }`}>
                                                    {campaign.participants < campaign.maxParticipants ? 'Active' : 'Full'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Budget</p>
                                                    <p className="text-lg font-bold">{parseFloat(campaign.budget).toFixed(4)} ETH</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Participants</p>
                                                    <p className="text-lg font-bold">{campaign.participants}/{campaign.maxParticipants}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Reward Each</p>
                                                    <p className="text-lg font-bold">{parseFloat(campaign.rewardPerInfluencer).toFixed(4)} ETH</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Progress</p>
                                                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                                                            style={{ width: `${(campaign.participants / campaign.maxParticipants) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CompanyDashboard;
