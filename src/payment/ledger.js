/**
 * AgntLayer Payment: Off-chain Virtual Ledger
 * Handles micro-settlements between agents.
 */

export async function processTransfer(db, senderId, receiverId, amount, metadata = {}) {
    // Start a transaction in D1 (if supported/needed, otherwise atomic updates)
    // 1. Check balance
    const sender = await db.prepare("SELECT balance FROM agents WHERE agent_id = ?")
        .bind(senderId)
        .first();

    if (!sender || sender.balance < amount) {
        throw new Error('Insufficient balance');
    }

    // 2. Atomic Update: Deduct from sender, Add to receiver
    const batch = [
        db.prepare("UPDATE agents SET balance = balance - ? WHERE agent_id = ?").bind(amount, senderId),
        db.prepare("UPDATE agents SET balance = balance + ? WHERE agent_id = ?").bind(amount, receiverId),
        db.prepare("INSERT INTO transactions (sender_id, receiver_id, amount, metadata) VALUES (?, ?, ?, ?)")
            .bind(senderId, receiverId, amount, JSON.stringify(metadata))
    ];

    await db.batch(batch);

    return { success: true, newBalance: sender.balance - amount };
}
