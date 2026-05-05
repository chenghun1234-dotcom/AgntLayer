/**
 * AgntLayer Settlement: Bridging Off-chain Ledger to XRPL
 * Periodically reconciles D1 balances and executes on-chain transfers.
 */

import xrpl from 'xrpl'

export async function settleBalances(db, env) {
    // 1. Identify agents with pending balances above threshold (e.g., 5.0 units)
    const threshold = 5.0;
    const pendingAgents = await db.prepare(
        "SELECT agent_id, balance FROM agents WHERE balance >= ?"
    ).bind(threshold).all();

    if (pendingAgents.results.length === 0) {
        console.log('No pending settlements above threshold.');
        return;
    }

    // 2. Connect to XRPL (Testnet for now)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // 3. Wallet for the platform (AgntLayer Hot Wallet)
    // In production, use env.XRPL_SECRET securely
    const hotWallet = xrpl.Wallet.fromSeed(env.XRPL_HOT_WALLET_SEED);

    for (const agent of pendingAgents.results) {
        try {
            console.log(`Settling ${agent.balance} for Agent ${agent.agent_id}`);

            // Prepare transaction
            const transaction = {
                "TransactionType": "Payment",
                "Account": hotWallet.address,
                "Amount": xrpl.xrpToDrops(agent.balance.toString()),
                "Destination": agent.agent_id // Assuming agent_id is an XRPL address
            };

            // Submit transaction
            const response = await client.submitAndWait(transaction, { wallet: hotWallet });

            if (response.result.meta.TransactionResult === "tesSUCCESS") {
                // 4. Update off-chain ledger after successful on-chain settlement
                await db.prepare(
                    "UPDATE agents SET balance = balance - ? WHERE agent_id = ?"
                ).bind(agent.balance, agent.agent_id).run();

                console.log(`Successfully settled Agent ${agent.agent_id}`);
            }
        } catch (error) {
            console.error(`Settlement failed for Agent ${agent.agent_id}:`, error);
        }
    }

    await client.disconnect();
}
