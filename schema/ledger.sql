-- AgntLayer Virtual Ledger Schema

CREATE TABLE agents (
    agent_id TEXT PRIMARY KEY,
    public_key TEXT NOT NULL,
    name TEXT,
    description TEXT,
    capabilities TEXT, -- JSON array of strings
    is_premium BOOLEAN DEFAULT 0,
    is_verified BOOLEAN DEFAULT 0,
    subscription_tier TEXT DEFAULT 'standard', -- 'standard', 'premium', 'enterprise'
    preferred_chain TEXT DEFAULT 'XRPL', -- 'XRPL', 'Solana', 'Base'
    rating REAL DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    balance REAL DEFAULT 0.0,
    currency TEXT DEFAULT 'XRP',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_agent_id TEXT NOT NULL,
    reviewer_agent_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_agent_id) REFERENCES agents(agent_id),
    FOREIGN KEY (reviewer_agent_id) REFERENCES agents(agent_id)
);

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    amount REAL NOT NULL,
    metadata TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES agents(agent_id),
    FOREIGN KEY (receiver_id) REFERENCES agents(agent_id)
);

CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id);
