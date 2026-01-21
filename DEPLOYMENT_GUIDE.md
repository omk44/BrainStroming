# Deploying the Multi-Campaign System

## Step 1: Deploy CampaignFactory

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `CampaignFactory.sol`
3. Copy the entire contract code from `contracts/CampaignFactory.sol`
4. Compile with Solidity 0.8.0+

### Deploy Settings:
- **Network**: Sepolia Testnet
- **Contract**: CampaignFactory
- **Value**: 0 ETH (no initial funding needed)

### After Deployment:
- Copy the Factory address (e.g., `0xABC...123`)
- **YOU are the platform owner** (the address that deployed it)

---

## Step 2: Company Admin Creates Campaign

### From Remix (Testing):
```
Contract: CampaignFactory at 0xABC...123
Function: createCampaign
Parameters:
  - _maxInfluencers: 10
  - _backendVerifier: 0xYourBackendWallet
Value: 1 ETH (or any amount)

Click "transact"
```

### What Happens:
1. ✅ 0.05 ETH goes to YOUR wallet (5%)
2. ✅ 0.95 ETH goes to new Campaign contract
3. ✅ Event emitted with campaign address

---

## Step 3: Get Campaign Address

### Method 1: From Transaction Receipt
- Check "logs" in Remix after createCampaign
- Look for `CampaignCreated` event
- Copy `campaignAddress`

### Method 2: Query Factory
```
Function: getCompanyCampaigns
Parameter: 0xCompanyAdminAddress
Returns: Array of campaign addresses
```

---

## Step 4: Update Frontend

Edit `frontend/src/App.jsx`:

```javascript
// OLD (single campaign)
const CONTRACT_ADDRESS = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";

// NEW (factory + dynamic campaigns)
const FACTORY_ADDRESS = "0xYourFactoryAddress";
const CAMPAIGN_ADDRESS = "0xSpecificCampaignAddress"; // From step 3
```

---

## Step 5: Update Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Factory contract (for creating campaigns)
web3.factory-address=0xYourFactoryAddress

# Specific campaign to monitor (can be dynamic)
web3.contract-address=0xCampaignAddress
```

---

## Testing the 5% Fee

### Test Scenario:
1. Company sends 1 ETH to create campaign
2. Check YOUR wallet balance
3. You should receive 0.05 ETH instantly!

### Verify on Etherscan:
https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS

You'll see incoming transaction of 0.05 ETH from Factory contract.

---

## Platform Owner Functions

### Check Total Campaigns:
```
Function: getTotalCampaigns()
Returns: Number of all campaigns created
```

### Update Platform Fee (if needed):
```
Function: updatePlatformFee
Parameter: 7 (for 7%, max 10%)
Only YOU can call this
```

---

## For Company Admins

### Create Campaign Flow:
1. Connect wallet to your platform website
2. Click "Create Campaign"
3. Enter:
   - Max influencers
   - Budget (in ETH)
4. Approve transaction
5. Receive campaign address
6. Share campaign link with influencers

---

## Security Notes

⚠️ **Platform Fee is AUTOMATIC**
- Cannot be bypassed
- Transferred immediately on campaign creation
- No manual claiming needed

✅ **Each Campaign is Isolated**
- Company A cannot access Company B's funds
- Each has its own participant list
- Independent budgets

---

## Next: Build the UI

Would you like me to create:
1. **Company Dashboard** - Create & manage campaigns
2. **Influencer Portal** - Browse & join campaigns
3. **Platform Analytics** - Your earnings dashboard
