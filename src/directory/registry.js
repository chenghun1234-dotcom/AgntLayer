/**
 * AgntLayer Directory: Agent Registry & Ranking System
 */

export async function updateAgentMetadata(db, agentId, metadata) {
    const { name, description, capabilities } = metadata;
    
    await db.prepare(`
        UPDATE agents 
        SET name = ?, description = ?, capabilities = ? 
        WHERE agent_id = ?
    `).bind(name, description, JSON.stringify(capabilities), agentId).run();
}

export async function getAgentDetail(db, agentId) {
    const result = await db.prepare(`
        SELECT agent_id, name, description, capabilities, is_premium, is_verified, rating, usage_count, subscription_tier, preferred_chain, balance, created_at 
        FROM agents 
        WHERE agent_id = ?
    `).bind(agentId).first();
    
    if (result) {
        result.capabilities = JSON.parse(result.capabilities || '[]');
        // Fetch recent reviews
        const reviews = await db.prepare(`
            SELECT reviewer_agent_id, rating, comment, created_at 
            FROM reviews 
            WHERE target_agent_id = ? 
            ORDER BY created_at DESC LIMIT 5
        `).bind(agentId).all();
        result.recent_reviews = reviews.results;
    }
    
    return result;
}

export async function listAgents(db, options = {}) {
    const { capability, premiumOnly, limit = 20 } = options;
    
    let query = "SELECT agent_id, name, description, capabilities, is_premium, is_verified, rating, usage_count FROM agents";
    let params = [];
    
    let conditions = [];
    if (premiumOnly) {
        conditions.push("is_premium = 1");
    }
    if (capability) {
        conditions.push("capabilities LIKE ?");
        params.push(`%${capability}%`);
    }
    
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    
    // Ranking: Premium first, then by rating, then by usage
    query += " ORDER BY is_premium DESC, rating DESC, usage_count DESC LIMIT ?";
    params.push(limit);
    
    const result = await db.prepare(query).bind(...params).all();
    return result.results;
}

export async function submitReview(db, targetId, reviewerId, rating, comment) {
    await db.prepare(`
        INSERT INTO reviews (target_agent_id, reviewer_agent_id, rating, comment)
        VALUES (?, ?, ?, ?)
    `).bind(targetId, reviewerId, rating, comment).run();
    
    // Update target agent's average rating
    await db.prepare(`
        UPDATE agents 
        SET rating = (SELECT AVG(rating) FROM reviews WHERE target_agent_id = ?)
        WHERE agent_id = ?
    `).bind(targetId, targetId).run();
}
