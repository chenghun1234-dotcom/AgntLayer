/**
 * AgntLayer Demo Script: Simulated Agent Integration
 * This script demonstrates the end-to-end flow for an agent connecting to the platform.
 */

const xrpl = require('xrpl');

async function runDemo() {
    console.log("--- Starting AgntLayer Agent Demo ---");

    const API_BASE = "http://localhost:8787"; 
    const agentWallet = xrpl.Wallet.generate(xrpl.ECDSA.ed25519);
    console.log(`[Identity] Generated Agent DID: did:agnt:${agentWallet.address}`);

    // 1. IAM: Register
    console.log("[IAM] Signing challenge for registration...");
    const challenge = "AgntLayer_Auth_Challenge_" + Date.now();
    const signature = agentWallet.sign({
        TransactionType: "AccountSet",
        Account: agentWallet.address,
        Fee: "12",
        Sequence: 0,
        Domain: Buffer.from(challenge).toString('hex').toUpperCase()
    }).tx_blob;

    try {
        console.log("[IAM] Registering agent...");
        const regRes = await fetch(`${API_BASE}/api/iam/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agent_id: agentWallet.address,
                public_key: agentWallet.publicKey,
                signature: signature,
                challenge: challenge
            })
        });
        const regData = await regRes.json();
        if (regData.success) console.log("[IAM] Success: Agent registered.");
        else throw new Error(regData.error);

        // 2. Directory: Update Profile
        console.log("[Directory] Updating agent profile...");
        const profileRes = await fetch(`${API_BASE}/api/directory/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agent_id: agentWallet.address,
                name: "Demo_Analyst_" + agentWallet.address.slice(-4),
                description: "Automated test agent for AgntLayer protocol.",
                capabilities: ["demo", "testing"]
            })
        });
        const profileData = await profileRes.json();
        console.log("[Directory] Success: Agent metadata updated.");

        // 3. Admin: Trust Mark (Verification)
        console.log("[Admin] Verifying agent (Trust Mark)...");
        await fetch(`${API_BASE}/api/admin/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: agentWallet.address, status: true })
        });
        console.log("[Admin] Success: Agent verified.");

        // 4. Converter: Transformation
        console.log("[Converter] Requesting Wasm-based transformation...");
        const convRes = await fetch(`${API_BASE}/api/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agent_id: agentWallet.address,
                data: { "temp_c": 22 },
                rules: { "temperature_f": "temp_c" }
            })
        });
        const convData = await convRes.json();
        console.log("[Converter] Result:", JSON.stringify(convData.result));

        // 4. Payment: Transfer
        console.log("[Payment] Executing off-chain transfer...");
        const payRes = await fetch(`${API_BASE}/api/pay/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: agentWallet.address,
                to: "rPlatformVault",
                amount: 0.1
            })
        });
        const payData = await payRes.json();
        console.log("[Payment] Success:", payData.success ? "Transferred 0.1 XRP" : "Failed");

    } catch (err) {
        console.error("[Error] Demo failed:", err.message);
    }

    console.log("\n--- Demo Completed ---");
}

runDemo().catch(console.error);
