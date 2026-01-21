package com.decentralized.marketing.service;

import com.decentralized.marketing.wrappers.CampaignContract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import java.math.BigInteger;

@Service
public class BlockchainService {

    @Value("${web3.rpc-url}")
    private String rpcUrl;

    @Value("${web3.private-key}")
    private String privateKey;

    @Value("${web3.contract-address}")
    private String contractAddress;

    private CampaignContract contract;

    public void init() {
        Web3j web3j = Web3j.build(new HttpService(rpcUrl));
        Credentials credentials = Credentials.create(privateKey);
        
        // Sepolia Gas Provider (roughly 3 Gwei, 3M limit)
        ContractGasProvider gasProvider = new StaticGasProvider(
            BigInteger.valueOf(3_000_000_000L), 
            BigInteger.valueOf(3_000_000)
        );

        contract = CampaignContract.load(contractAddress, web3j, credentials, gasProvider);
        System.out.println("Connected to Contract: " + contractAddress);
    }

    public void triggerReward(String influencerAddress, BigInteger amountWei) throws Exception {
        if (contract == null) {
            init();
        }
        System.out.println("Processing Reward for: " + influencerAddress);
        var receipt = contract.sendPrize(influencerAddress, amountWei).send();
        System.out.println("Transaction Hash: " + receipt.getTransactionHash());
    }
}
