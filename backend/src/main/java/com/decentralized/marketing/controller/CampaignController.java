package com.decentralized.marketing.controller;

import com.decentralized.marketing.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/campaign")
@CrossOrigin(origins = "*") // Allow Frontend to call this
public class CampaignController {

    @Autowired
    private BlockchainService blockchainService;

    // MOCK API: In real life, this would be an automatic Scheduled Task that checks X API.
    // Here, we trigger it manually to simulate "Yes, this person got 1000 views".
    @PostMapping("/verify/{influencerAddress}")
    public String verifyAndPay(@PathVariable String influencerAddress) {
        try {
            // Logic: checkXApi(influencerAddress)... if (views > 1000)...
            
            // Hardcoded Reward: 0.001 ETH (in Wei)
            BigInteger rewardAmount = new BigInteger("1000000000000000"); 
            
            blockchainService.triggerReward(influencerAddress, rewardAmount);
            return "Success! Payout triggered for: " + influencerAddress;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
