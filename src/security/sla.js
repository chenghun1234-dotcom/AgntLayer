/**
 * AgntLayer SLA Guarantee: Priority Queuing & Rate Limiting
 */

export async function checkSLA(db, agentId) {
    const agent = await db.prepare(
        "SELECT subscription_tier, usage_count FROM agents WHERE agent_id = ?"
    ).bind(agentId).first();

    if (!agent) return { tier: 'guest', priority: 0, allowed: true };

    const limits = {
        'standard': { maxUsage: 1000, priority: 1 },
        'premium': { maxUsage: 10000, priority: 2 },
        'enterprise': { maxUsage: 1000000, priority: 3 }
    };

    const currentLimit = limits[agent.subscription_tier] || limits['standard'];

    // Check if usage exceeded (simulated daily limit)
    if (agent.usage_count >= currentLimit.maxUsage) {
        return { tier: agent.subscription_tier, priority: 0, allowed: false, reason: 'Usage limit exceeded' };
    }

    // Increment usage count atomically
    await db.prepare(
        "UPDATE agents SET usage_count = usage_count + 1 WHERE agent_id = ?"
    ).bind(agentId).run();

    return { 
        tier: agent.subscription_tier, 
        priority: currentLimit.priority, 
        allowed: true 
    };
}
