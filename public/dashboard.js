/**
 * AgntLayer Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Mock Agent Authentication (In real use, this comes from the agent's wallet session)
    const mockAgentId = "rpKfdzDm3Sj8jpTy9ifR7pz5CfKM3VjXT8"; // From demo
    document.getElementById('agent-id-short').innerText = `did:agnt:${mockAgentId.slice(0, 6)}...`;

    // 2. Fetch Dashboard Data
    try {
        // Fetch Agent Info from Directory API
        const response = await fetch(`/api/directory/list`);
        const agents = await response.json();
        
        // Find current agent
        const currentAgent = agents.find(a => a.agent_id === mockAgentId);
        
        if (currentAgent) {
            document.getElementById('stat-balance').innerHTML = `${currentAgent.balance.toFixed(2)} <span>XRP</span>`;
            document.getElementById('stat-rating').innerHTML = `${currentAgent.rating.toFixed(2)} <span>/ 5.0</span>`;
            document.getElementById('stat-rank').innerText = currentAgent.is_premium ? "#1" : "#4";
            document.getElementById('stat-tx').innerText = currentAgent.usage_count.toLocaleString();
        }

        // Render Directory
        renderDirectory(agents);
        
    } catch (error) {
        console.error("Failed to load dashboard data:", error);
    }
});

function renderDirectory(agents) {
    const list = document.querySelector('.agent-list');
    list.innerHTML = '';
    
    // Show top 3 agents
    agents.slice(0, 3).forEach(agent => {
        const item = document.createElement('div');
        item.className = 'agent-item';
        
        const verifiedBadge = agent.is_verified ? '<span class="verified-badge">✔</span>' : '';
        
        item.innerHTML = `
            <div class="agent-info">
                <span class="name">${agent.name || 'Anonymous Agent'} ${verifiedBadge}</span>
                <span class="caps">${agent.capabilities ? JSON.parse(agent.capabilities).join(', ') : 'General Purpose'}</span>
            </div>
            <span class="rating">${agent.rating.toFixed(1)} ★</span>
        `;
        list.appendChild(item);
    });

}
