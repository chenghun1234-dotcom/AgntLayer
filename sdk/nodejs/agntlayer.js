/**
 * AgntLayer Node.js SDK
 */

class AgntLayerClient {
    constructor(apiBase = "https://agntlayer.chenghun1234.workers.dev") {
        this.apiBase = apiBase;
    }

    async register(agentId, publicKey, signature, challenge) {
        const res = await fetch(`${this.apiBase}/api/iam/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: agentId, public_key: publicKey, signature, challenge })
        });
        return res.json();
    }

    async convert(agentId, data, rules) {
        const res = await fetch(`${this.apiBase}/api/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: agentId, data, rules })
        });
        return res.json();
    }

    async transfer(senderId, receiverId, amount, metadata = {}) {
        const res = await fetch(`${this.apiBase}/api/pay/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId, amount, metadata })
        });
        return res.json();
    }

    async getDirectory(options = {}) {
        const params = new URLSearchParams(options);
        const res = await fetch(`${this.apiBase}/api/directory/list?${params.toString()}`);
        return res.json();
    }
}

module.exports = AgntLayerClient;
