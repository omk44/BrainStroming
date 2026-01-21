# Project Architecture Explanation
## Decentralized Influencer Marketing Platform

This document explains the complete technical architecture for team members and stakeholders.

---

## 🎯 Project Overview

**What We Built:**
A blockchain-based platform where ONE company can run an influencer marketing campaign. Influencers join by connecting their wallet, and get paid automatically in ETH when they meet engagement criteria (views, likes, comments on X/Twitter).

**Key Innovation:**
Payments are automatic, transparent, and cannot be manipulated once the smart contract is deployed.

---

## 🏗️ Technology Stack

### 1. **Blockchain Layer** (The Trust Foundation)
- **Network**: Ethereum Sepolia Testnet
- **Smart Contract**: `InfluencerCampaign.sol` (Written in Solidity)
- **Deployed At**: `0xf8e81D47203A594245E36C48e151709F0C19fBe8`

**What it does:**
- Stores campaign rules (max 10 influencers, reward amount)
- Holds the company's ETH budget
- Executes automatic payments when triggered
- Records all participants and their payment status

### 2. **Backend** (The Verification Brain)
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.1
- **Blockchain Library**: Web3j 4.9.8

**What it does:**
- Connects to blockchain via Alchemy RPC
- Verifies influencer engagement on X (Twitter) API
- Triggers smart contract to release payments
- Acts as the "oracle" (data provider)

### 3. **Frontend** (The User Interface)
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS + Custom Glassmorphism
- **Blockchain Library**: Ethers.js v6

**What it does:**
- Allows influencers to connect MetaMask wallet
- Submit their X handle to join campaign
- Shows participation status
- Displays contract address and network info

---

## 🔄 Complete System Workflow

### **Phase 1: Company Setup (One-time)**

```
1. Company Owner (You)
   ↓
2. Deploys Smart Contract on Sepolia
   - Sends initial ETH budget (e.g., 0.1 ETH)
   - Sets max participants (10)
   - Defines reward per influencer (0.01 ETH each)
   ↓
3. Contract Address Generated: 0xf8e...
   ↓
4. Company configures Backend:
   - Adds contract address to application.properties
   - Adds company wallet private key
   - Adds Alchemy RPC URL
```

### **Phase 2: Influencer Joins Campaign**

```
1. Influencer visits website (localhost:5173)
   ↓
2. Clicks "Connect Wallet"
   - MetaMask popup appears
   - Influencer approves connection
   ↓
3. Frontend reads their wallet address
   Example: 0x1234...5678
   ↓
4. Influencer enters X handle: @influencer_name
   ↓
5. Clicks "Join Campaign"
   ↓
6. Frontend calls Smart Contract function:
   contract.joinCampaign("@influencer_name")
   ↓
7. MetaMask asks for approval (gas fee ~$0.50)
   ↓
8. Transaction sent to Sepolia blockchain
   ↓
9. After ~15 seconds, transaction confirmed
   ↓
10. Smart Contract stores:
    - Influencer wallet: 0x1234...5678
    - X handle: @influencer_name
    - Status: Registered, Not Paid
```

### **Phase 3: Backend Verification & Payment**

```
1. Backend runs periodic check (every hour)
   ↓
2. For each registered influencer:
   - Fetch their X profile via X API
   - Check engagement metrics:
     * Views on campaign post
     * Likes, Comments, Retweets
   ↓
3. If criteria met (e.g., 1000+ views):
   ↓
4. Backend calls Smart Contract:
   contract.payoutReward(influencerAddress, amount)
   ↓
5. Smart Contract verifies:
   - Is caller the authorized backend? ✓
   - Is influencer registered? ✓
   - Has influencer been paid already? ✗
   - Does contract have enough ETH? ✓
   ↓
6. Smart Contract transfers ETH:
   From: Contract (0xf8e...)
   To: Influencer (0x1234...)
   Amount: 0.01 ETH
   ↓
7. Influencer sees ETH in MetaMask instantly!
   ↓
8. Smart Contract marks influencer as "Paid"
```

---

## 🔑 Key Components Explained

### **1. Company's Wallet Private Key**
```
Location: backend/src/main/resources/application.properties
Value: 90461859914ab0c3835e69e41c9e965225b7707ad11eab4cbf052e600a78801a
```

**What it does:**
- Allows backend to "sign" transactions on behalf of the company
- Required to trigger `payoutReward()` function
- **CRITICAL**: Never share this or commit to GitHub!

**How it's used:**
```java
Credentials credentials = Credentials.create(privateKey);
// Backend can now send transactions as the company
```

### **2. Alchemy RPC URL**
```
Location: backend/src/main/resources/application.properties
Value: https://eth-sepolia.g.alchemy.com/v2/-tB0bBZjGVm1oDiCebvQY
```

**What it does:**
- Acts as the "phone line" to Ethereum blockchain
- Without this, backend cannot read or write to blockchain
- Alchemy maintains the actual Ethereum node (saves us from running 800GB server)

**How it's used:**
```java
Web3j web3j = Web3j.build(new HttpService(rpcUrl));
// Backend can now talk to blockchain
```

### **3. Smart Contract Address**
```
Value: 0xf8e81D47203A594245E36C48e151709F0C19fBe8
```

**What it does:**
- The "home" where the campaign lives on blockchain
- All influencers interact with THIS specific address
- Contains the ETH budget and campaign rules

**How it's used:**
```javascript
// Frontend
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// Backend
CampaignContract contract = CampaignContract.load(contractAddress, web3j, credentials, gasProvider);
```

---

## 💰 Money Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  COMPANY WALLET (MetaMask)                              │
│  Balance: 1.0 ETH                                       │
└─────────────────────────────────────────────────────────┘
                    │
                    │ (1) Deploy Contract + Send 0.1 ETH
                    ↓
┌─────────────────────────────────────────────────────────┐
│  SMART CONTRACT (0xf8e...)                              │
│  Balance: 0.1 ETH                                       │
│  Rules: Max 10 influencers, 0.01 ETH each              │
└─────────────────────────────────────────────────────────┘
                    │
                    │ (2) Backend triggers payment
                    ↓
┌─────────────────────────────────────────────────────────┐
│  INFLUENCER WALLET (0x1234...)                          │
│  Balance: 0.01 ETH (Received!)                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Trust Model

### **What IS Decentralized:**
✅ Payment execution (Smart contract cannot be stopped)
✅ Transaction history (Immutable on blockchain)
✅ Campaign rules (Cannot be changed after deployment)

### **What is NOT Decentralized (Current Limitation):**
❌ Verification logic (Java backend decides who qualifies)
❌ X API access (Centralized Twitter servers)

**Future Solution:** Migrate to Chainlink DON for decentralized verification.

---

## 📊 Data Storage

### **On Blockchain (Public & Permanent):**
- Influencer wallet addresses
- X handles
- Payment status (paid/unpaid)
- Transaction history

### **Off Blockchain (Backend Database - Optional):**
- X API tokens
- Engagement metrics cache
- Verification logs

---

## 🚀 How to Run (Quick Start)

### **Backend:**
```bash
cd backend
mvn spring-boot:run
# Runs on: http://localhost:8082
```

### **Frontend:**
```bash
cd frontend
npm run dev
# Runs on: http://localhost:5173
```

### **Prerequisites:**
- Java 21+
- Node.js 18+
- MetaMask with Sepolia ETH
- Alchemy API key

---

## 🎓 For Your Team Members

### **If you're a Frontend Developer:**
- Focus on `frontend/src/App.jsx`
- Learn Ethers.js for wallet connection
- Understand MetaMask integration

### **If you're a Backend Developer:**
- Focus on `backend/src/main/java/.../service/BlockchainService.java`
- Learn Web3j library
- Understand how to sign transactions

### **If you're a Smart Contract Developer:**
- Focus on `contracts/InfluencerCampaign.sol`
- Learn Solidity syntax
- Understand gas optimization

---

## 🔮 Future Enhancements

1. **Multi-Campaign Support**: Factory pattern for multiple companies
2. **Decentralized Verification**: Chainlink DON integration
3. **Advanced Metrics**: Track engagement over time
4. **NFT Badges**: Issue NFTs to top performers
5. **Mainnet Deployment**: Move from testnet to production

---

## 📞 Technical Support

For questions, refer to:
- Smart Contract: `contracts/InfluencerCampaign.sol`
- Backend Logic: `backend/src/main/java/com/decentralized/marketing/`
- Frontend UI: `frontend/src/App.jsx`
- Main README: `README.md`
