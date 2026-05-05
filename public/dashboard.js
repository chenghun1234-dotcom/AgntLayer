/**
 * AgntLayer Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Mock Agent Authentication
    const mockAgentId = "rpKfdzDm3Sj8jpTy9ifR7pz5CfKM3VjXT8"; 
    document.getElementById('agent-id-short').innerText = `did:agnt:${mockAgentId.slice(0, 6)}...`;

    async function loadAgents(query = '') {
        try {
            const url = query ? `/api/directory/list?capability=${query}` : `/api/directory/list`;
            const response = await fetch(url);
            const data = await response.json();
            const agents = data.agents || [];
            
            // Find current agent
            const currentAgent = agents.find(a => a.agent_id === mockAgentId);
            if (currentAgent) {
                document.getElementById('stat-balance').innerHTML = `${currentAgent.balance.toFixed(2)} <span>XRP</span>`;
                document.getElementById('stat-rating').innerHTML = `${currentAgent.rating.toFixed(2)} <span>/ 5.0</span>`;
                document.getElementById('stat-rank').innerText = currentAgent.is_premium ? "#1" : "#4";
                document.getElementById('stat-tx').innerText = currentAgent.usage_count.toLocaleString();
            }

            renderDirectory(agents);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
    }

    // Search functionality
    const searchInput = document.getElementById('directory-search');
    searchInput.addEventListener('input', (e) => {
        loadAgents(e.target.value);
    });

    // Initial load
    loadAgents();
});

function renderDirectory(agents) {
    const list = document.querySelector('.agent-list');
    list.innerHTML = '';
    
    agents.slice(0, 5).forEach(agent => {
        const item = document.createElement('div');
        item.className = 'agent-item';
        
        const verifiedBadge = agent.is_verified ? '<span class="verified-badge" title="AgntLayer Verified">✔</span>' : '';
        const premiumClass = agent.is_premium ? 'premium-agent' : '';
        
        item.innerHTML = `
            <div class="agent-info ${premiumClass}">
                <span class="name">${agent.name || 'Anonymous Agent'} ${verifiedBadge}</span>
                <span class="caps">${agent.capabilities ? JSON.parse(agent.capabilities).join(', ') : 'General Purpose'}</span>
            </div>
            <span class="rating">${agent.rating.toFixed(1)} ★</span>
        `;
        list.appendChild(item);
    });
}
