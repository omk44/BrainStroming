# BrainStroming - Decentralized Influencer Marketing Platform

> **⚠️ SECURITY NOTICE**: This repository does not contain sensitive credentials. You must configure your own API keys and private keys locally.

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven
- MetaMask wallet with Sepolia ETH

### 1️⃣ Clone the Repository
```bash
git clone git@github.com:omk44/BrainStroming.git
cd BrainStroming
```

### 2️⃣ Configure Backend Secrets

**IMPORTANT:** Create your own configuration file:

```bash
cd backend/src/main/resources
cp application.properties.example application.properties
```

Then edit `application.properties` with your actual values:
```properties
web3.rpc-url=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
web3.private-key=YOUR_METAMASK_PRIVATE_KEY
web3.contract-address=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

**Where to get these:**
- **Alchemy Key**: Sign up at [alchemy.com](https://www.alchemy.com/) (free)
- **Private Key**: Export from MetaMask (Account Details > Export Private Key)
- **Contract Address**: Deploy `contracts/InfluencerCampaign.sol` via Remix

### 3️⃣ Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: `http://localhost:8082`

### 4️⃣ Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete technical architecture
- **[Smart Contract](./contracts/InfluencerCampaign.sol)** - Solidity code

---

## 🔐 Security Best Practices

**Never commit these files:**
- ❌ `application.properties` (contains secrets)
- ❌ `.env` files
- ❌ Private keys
- ❌ API keys

**Always use:**
- ✅ `application.properties.example` (template with placeholders)
- ✅ Environment variables for production
- ✅ `.gitignore` to exclude secrets

---

## 🏗️ Project Structure

```
BrainStroming/
├── backend/                 # Java Spring Boot
│   ├── src/main/java/      # Business logic
│   └── src/main/resources/
│       └── application.properties.example  # Config template
├── frontend/               # React + Vite
│   └── src/
├── contracts/              # Solidity smart contracts
└── ARCHITECTURE.md         # Technical documentation
```

---

## 🎯 Features

- ✅ Blockchain-based campaign management
- ✅ Automatic ETH payments to influencers
- ✅ MetaMask wallet integration
- ✅ Sepolia testnet support
- ✅ Real-time verification (mock)

---

## 🔮 Future Enhancements

- [ ] Chainlink DON integration for decentralized verification
- [ ] Multi-campaign factory pattern
- [ ] Real X (Twitter) API integration
- [ ] NFT badges for top performers

---

## 📞 Support

For setup issues, check:
1. You created `application.properties` from the example
2. Your Alchemy key is valid
3. Your MetaMask is on Sepolia network
4. You have Sepolia ETH for gas fees

---

## ⚖️ License

MIT License - See LICENSE file for details
