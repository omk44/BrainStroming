# Decentralized Campaign & Influencer Rewards Platform

> **Status**: Phase 2 Complete (Smart Contract deployed, Frontend & Backend Connected)  
> **Blockchain**: Sepolia Testnet  
> **Contract Address**: `0xf8e81D47203A594245E36C48e151709F0C19fBe8`

This file contains **everything** your partner needs to run this project on their computer.

---

## � STEP 1: Configure Keys (DO THIS FIRST)

Before running any code, you must set up the secret keys.

1.  Open this file in your code editor:
    👉 `backend/src/main/resources/application.properties`

2.  You will see 3 lines waiting for your keys. Change them to your own values:

    ```properties
    # 1. Get a free API Key from alchemy.com (Select 'Ethereum Sepolia')
    web3.rpc-url=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
    
    # 2. Your Wallet Private Key (Must have some Sepolia ETH)
    web3.private-key=YOUR_PRIVATE_KEY_HERE
    
    # 3. The Smart Contract Address (Already set, but checking doesn't hurt)
    web3.contract-address=0xf8e81D47203A594245E36C48e151709F0C19fBe8
    ```

---

## 🧠 STEP 2: Run the Backend (Server)

Open your **Terminal** (Command Prompt) and run these commands **one by one**:

1.  Go into the backend folder:
    ```bash
    cd backend
    ```

2.  Install all Java libraries (do this once):
    ```bash
    mvn clean install
    ```

3.  Start the server:
    ```bash
    mvn spring-boot:run
    ```

✅ **Success?** You will see a message saying: `Connected to Contract: 0xf8e...` and `Started InfluencerMarketingApplication`.
❌ **Keep this terminal open!** Do not close it.

---

## 🎨 STEP 3: Run the Frontend (Website)

Open a **NEW Terminal window** (keep the backend one running) and run these:

1.  Go into the frontend folder:
    ```bash
    cd frontend
    ```

2.  Install all JavaScript libraries (do this once):
    ```bash
    npm install
    ```

3.  Start the website:
    ```bash
    npm run dev
    ```

✅ **Success?** It will say: `Local: http://localhost:5173/`.
👉 Open that link in your Chrome browser.

---

## 🎮 How to Test (For your Partner)

1.  **Connect Wallet**:
    *   Click the "Connect Wallet" button.
    *   **MetaMask** will pop up. Approve the connection.
    *   *Note*: Ensure your MetaMask is on the **Sepolia Testnet**.

2.  **Join the Campaign**:
    *   In the text box, type your X (Twitter) handle.
    *   ⚠️ **IMPORTANT**: You MUST include the `@` symbol (e.g., `@omm_43`).
    *   Click "Join Campaign".
    *   Confirm the transaction in MetaMask.
    *   Wait ~15 seconds for the blockchain to update. The UI will change to "Participating".

---

## 📂 Project Structure (For Reference)

*   `backend/`: The Java Logic (Spring Boot + Web3j).
*   `frontend/`: The Website (React + Tailwind).
*   `contracts/`: The Smart Contract code (`InfluencerCampaign.sol`).

---

## 🛠 Troubleshooting Common Errors

*   **Alert: "Please correct twitter handle format"**: 
    *   You forgot the `@`. Type `@username`.
*   **Terminal Error: "mvn: command not found"**: 
    *   You need to install **Maven** and **Java**.
*   **Terminal Error: "npm: command not found"**: 
    *   You need to install **Node.js**.
*   **Backend Error: "Transaction Reverted"**: 
    *   Your wallet (Private Key) has 0 Sepolia ETH. Go to a **Sepolia Faucet** to get free test money.
