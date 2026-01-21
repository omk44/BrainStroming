// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CampaignFactory
 * @dev Factory contract to create multiple influencer campaigns
 * Platform owner receives 5% fee from each campaign automatically
 */
contract CampaignFactory {
    address public platformOwner;
    uint256 public platformFeePercent = 5; // 5% platform fee
    
    // Array of all created campaigns
    address[] public allCampaigns;
    
    // Mapping: company admin => their campaigns
    mapping(address => address[]) public companyCampaigns;
    
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed companyAdmin,
        uint256 totalBudget,
        uint256 platformFee,
        uint256 campaignBudget
    );
    
    constructor() {
        platformOwner = msg.sender; // You are the platform owner
    }
    
    /**
     * @dev Create a new campaign
     * Company admin calls this with ETH
     * 5% goes to platform owner, 95% goes to campaign
     */
    function createCampaign(
        uint256 _maxInfluencers,
        address _backendVerifier
    ) external payable returns (address) {
        require(msg.value > 0, "Must send ETH for campaign budget");
        require(_maxInfluencers > 0, "Must allow at least 1 influencer");
        
        // Calculate fees
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 campaignBudget = msg.value - platformFee;
        
        // Transfer 5% to platform owner immediately
        payable(platformOwner).transfer(platformFee);
        
        // Deploy new campaign contract
        InfluencerCampaign newCampaign = new InfluencerCampaign{value: campaignBudget}(
            msg.sender,           // Company admin
            _backendVerifier,     // Backend wallet
            _maxInfluencers
        );
        
        address campaignAddress = address(newCampaign);
        
        // Track the campaign
        allCampaigns.push(campaignAddress);
        companyCampaigns[msg.sender].push(campaignAddress);
        
        emit CampaignCreated(
            campaignAddress,
            msg.sender,
            msg.value,
            platformFee,
            campaignBudget
        );
        
        return campaignAddress;
    }
    
    /**
     * @dev Get all campaigns created by a specific company
     */
    function getCompanyCampaigns(address _company) external view returns (address[] memory) {
        return companyCampaigns[_company];
    }
    
    /**
     * @dev Get total number of campaigns on platform
     */
    function getTotalCampaigns() external view returns (uint256) {
        return allCampaigns.length;
    }
    
    /**
     * @dev Platform owner can update fee (max 10%)
     */
    function updatePlatformFee(uint256 _newFeePercent) external {
        require(msg.sender == platformOwner, "Only platform owner");
        require(_newFeePercent <= 10, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }
}

/**
 * @title InfluencerCampaign
 * @dev Individual campaign contract (created by factory)
 */
contract InfluencerCampaign {
    address public brandOwner;      // Company admin who created this campaign
    address public backendVerifier; // Backend wallet authorized to trigger payments
    uint256 public maxInfluencers;
    uint256 public rewardPerInfluencer;
    uint256 public participantCount;
    
    struct Influencer {
        address wallet;
        string xHandle;
        bool registered;
        bool paid;
    }
    
    mapping(address => Influencer) public influencers;
    address[] public influencerList;
    
    event InfluencerJoined(address indexed wallet, string xHandle);
    event RewardPaid(address indexed influencer, uint256 amount);
    
    constructor(
        address _brandOwner,
        address _backendVerifier,
        uint256 _maxInfluencers
    ) payable {
        brandOwner = _brandOwner;
        backendVerifier = _backendVerifier;
        maxInfluencers = _maxInfluencers;
        
        // Calculate reward per influencer based on received budget
        rewardPerInfluencer = msg.value / _maxInfluencers;
    }
    
    /**
     * @dev Influencer joins the campaign
     */
    function joinCampaign(string memory _xHandle) external {
        require(participantCount < maxInfluencers, "Campaign is full");
        require(!influencers[msg.sender].registered, "Already registered");
        require(bytes(_xHandle).length > 0, "X handle required");
        
        influencers[msg.sender] = Influencer({
            wallet: msg.sender,
            xHandle: _xHandle,
            registered: true,
            paid: false
        });
        
        influencerList.push(msg.sender);
        participantCount++;
        
        emit InfluencerJoined(msg.sender, _xHandle);
    }
    
    /**
     * @dev Backend triggers payment after verification
     */
    function payoutReward(address _influencer, uint256 _amount) external {
        require(msg.sender == backendVerifier, "Only backend can trigger payout");
        require(influencers[_influencer].registered, "Influencer not registered");
        require(!influencers[_influencer].paid, "Already paid");
        require(address(this).balance >= _amount, "Insufficient campaign balance");
        
        influencers[_influencer].paid = true;
        payable(_influencer).transfer(_amount);
        
        emit RewardPaid(_influencer, _amount);
    }
    
    /**
     * @dev Get campaign details
     */
    function getCampaignInfo() external view returns (
        address owner,
        uint256 budget,
        uint256 participants,
        uint256 maxParticipants,
        uint256 reward
    ) {
        return (
            brandOwner,
            address(this).balance,
            participantCount,
            maxInfluencers,
            rewardPerInfluencer
        );
    }
    
    /**
     * @dev Get all influencers in this campaign
     */
    function getAllInfluencers() external view returns (address[] memory) {
        return influencerList;
    }
}
