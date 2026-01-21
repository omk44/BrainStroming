// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title InfluencerCampaign
 * @dev Manages a decentralized marketing campaign where 10 influencers can join.
 * Rewards are released automatically by a trusted backend verifier upon meeting off-chain criteria.
 */
contract InfluencerCampaign {
    address public brandOwner;      // The company creating the campaign
    address public backendVerifier; // The Java Backend wallet that verifies X (Twitter) stats
    
    uint256 public constant MAX_INFLUENCERS = 10;
    uint256 public totalBudget;
    uint256 public rewardPerInfluencer;
    
    struct Influencer {
        address wallet;
        string xHandle; // Twitter handle (e.g., "@omkapadiya")
        bool registered;
        bool paid;
    }
    
    mapping(address => Influencer) public influencers;
    address[] public influencerList;
    
    event InfluencerJoined(address indexed influencer, string xHandle);
    event RewardPaid(address indexed influencer, uint256 amount);
    event CampaignFunded(uint256 amount);

    modifier onlyVerifier() {
        require(msg.sender == backendVerifier, "Only verified backend can trigger payouts");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == brandOwner, "Only brand owner");
        _;
    }

    /**
     * @dev Initialize campaign. Payble to accept the budget immediately.
     * @param _backendVerifier Address of the Java backend wallet
     */
    constructor(address _backendVerifier) payable {
        brandOwner = msg.sender;
        backendVerifier = _backendVerifier;
        totalBudget = msg.value;
        
        // Logic: 10 Influencers get an equal share of the total budget (10% each)
        if (totalBudget > 0) {
            rewardPerInfluencer = totalBudget / MAX_INFLUENCERS;
        }
    }

    /**
     * @dev Influencers call this function to join the campaign.
     * @param _xHandle Their X (Twitter) handle for verification
     */
    function joinCampaign(string memory _xHandle) external {
        require(influencerList.length < MAX_INFLUENCERS, "Campaign is full (Max 10)");
        require(!influencers[msg.sender].registered, "You have already joined");
        
        influencers[msg.sender] = Influencer(msg.sender, _xHandle, true, false);
        influencerList.push(msg.sender);
        
        emit InfluencerJoined(msg.sender, _xHandle);
    }

    /**
     * @dev Called by the Java Backend after verifying Views/Likes on X API.
     * Triggers the release of ETH to the influencer.
     * @param _influencer The wallet address of the qualified influencer
     */
    function payoutReward(address _influencer) external onlyVerifier {
        require(influencers[_influencer].registered, "Influencer is not registered in this campaign");
        require(!influencers[_influencer].paid, "Influencer has already been paid");
        require(address(this).balance >= rewardPerInfluencer, "Insufficient contract balance");

        influencers[_influencer].paid = true;
        payable(_influencer).transfer(rewardPerInfluencer);
        
        emit RewardPaid(_influencer, rewardPerInfluencer);
    }

    /**
     * @dev Allows the brand to withdraw leftover funds if needed.
     */
    function withdrawFunds() external onlyOwner {
        payable(brandOwner).transfer(address(this).balance);
    }

    /**
     * @dev Get current number of participants
     */
    function getParticipantCount() external view returns (uint256) {
        return influencerList.length;
    }
}
