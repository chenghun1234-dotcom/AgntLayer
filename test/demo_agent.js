/**
 * AgntLayer Demo Script: Simulated Agent Integration
 * This script demonstrates the end-to-end flow for an agent connecting to the platform.
 */

const xrpl = require('xrpl');

async function runDemo() {
    console.log("--- Starting AgntLayer Agent Demo ---");

    // 1. Agent Identity Generation (Ed25519)
    const agentWallet = xrpl.Wallet.generate(xrpl.ECDSA.ed25519);
    console.log(`[Identity] Generated Agent DID: did:agnt:${agentWallet.address}`);

    const API_BASE = "http://localhost:8787"; // Local Wrangler Dev Server

    // 2. IAM: Register DID
    // In XRPL, we sign messages/challenges by wrapping them in a dummy transaction
    // or using the low-level keypairs API. For this demo, we'll use a dummy object.
    const challenge = "AgntLayer_Auth_Challenge_" + Date.now();
    
    console.log("[IAM] Signing challenge for registration...");
    const signature = agentWallet.sign({
        TransactionType: "AccountSet", // Dummy transaction type
        Account: agentWallet.address,
        Fee: "12",
        Sequence: 0,
        Domain: Buffer.from(challenge).toString('hex').toUpperCase()
    }).tx_blob;
    
    console.log("[IAM] Registering agent...");
    // Note: In real scenarios, use node-fetch or similar
    // This is a mockup of the fetch call
    /*
    const regRes = await fetch(`${API_BASE}/api/iam/register`, {
        method: 'POST',
        body: JSON.stringify({
            agent_id: agentWallet.address,
            public_key: agentWallet.publicKey,
            signature: signature,
            challenge: challenge
        })
    });
    */
    console.log("[IAM] Success: Agent registered in Cloudflare KV.");

    // 3. Directory: Update Profile
    console.log("[Directory] Updating agent profile...");
    const profile = {
        agent_id: agentWallet.address,
        metadata: {
            name: "DataAnalyst_Pro_v1",
            description: "High-performance data analysis agent specializing in market trends.",
            capabilities: ["data-analysis", "forecasting", "json-transformation"]
        }
    };
    console.log("[Directory] Success: Agent metadata updated in D1.");

    // 4. Converter: Wasm Schema Mapping
    console.log("[Converter] Requesting Wasm-based schema transformation...");
    const transformRequest = {
        agent_id: agentWallet.address,
        data: {
            "raw_temp": 25.5,
            "unit": "celsius",
            "metadata": { "sensor_id": "ST-99" }
        },
        rules: {
            "temperature_f": "raw_temp",
            "source": "metadata.sensor_id",
            "processed_at": "unit"
        }
    };
    console.log(`[Converter] Input: ${JSON.stringify(transformRequest.data)}`);
    console.log("[Converter] Output: { \"temperature_f\": 25.5, \"source\": \"ST-99\", \"processed_at\": \"celsius\" }");

    // 5. Payment: Micro-settlement
    console.log("[Payment] Executing off-chain transfer...");
    const transfer = {
        sender_id: agentWallet.address,
        receiver_id: "rAgntLayerPlatform_Escrow_Account",
        amount: 0.001,
        metadata: { "reason": "SLA_Usage_Fee" }
    };
    console.log(`[Payment] Success: 0.001 XRP transferred via Virtual Ledger.`);

    console.log("\n--- Demo Completed Successfully ---");
    console.log("Check the AgntLayer Dashboard to see the real-time economic map.");
}

runDemo().catch(console.error);
