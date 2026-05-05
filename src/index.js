import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'
import { verifyAgentSignature, registerDID } from './iam/did'
import { processTransfer } from './payment/ledger'
import init, { transform } from './converter/agnt_converter'
import { updateAgentMetadata, listAgents, submitReview } from './directory/registry'
import { settleBalances } from './payment/settlement'
import { checkSLA } from './security/sla'

const app = new Hono()

// Explicit Routes for Main Pages
app.get('/', serveStatic({ path: './index.html', manifest }))
app.get('/index.html', serveStatic({ path: './index.html', manifest }))
app.get('/dashboard', serveStatic({ path: './dashboard.html', manifest }))
app.get('/dashboard.html', serveStatic({ path: './dashboard.html', manifest }))

// Static Assets: Serving CSS, JS, Images
app.get('/*', serveStatic({ root: './', manifest }))

// IAM: DID Registration & Verification
app.post('/api/iam/register', async (c) => {
    const { agent_id, public_key, signature, challenge } = await c.req.json()
    const isValid = await verifyAgentSignature(public_key, signature, challenge)
    if (!isValid) return c.json({ error: 'Invalid signature' }, 401)
    await registerDID(c.env.AGNT_IDENTITY, agent_id, public_key)
    return c.json({ status: 'success', message: 'Agent DID registered' })
})

// Payment: Micro-settlement Ledger
app.post('/api/pay/transfer', async (c) => {
    const { sender_id, receiver_id, amount, metadata } = await c.req.json()
    try {
        const result = await processTransfer(c.env.AGNT_DB, sender_id, receiver_id, amount, metadata)
        return c.json(result)
    } catch (e) {
        return c.json({ error: e.message }, 400)
    }
})

// Converter: Schema Mapping using Rust/Wasm (with SLA Guarantee)
app.post('/api/convert', async (c) => {
    const { agent_id, data, rules } = await c.req.json()
    
    // 1. Check SLA status
    const sla = await checkSLA(c.env.AGNT_DB, agent_id)
    if (!sla.allowed) {
        return c.json({ error: 'SLA Limit Exceeded', reason: sla.reason }, 429)
    }

    try {
        // Priority logic: Enterprise agents get faster processing (conceptually)
        // In a shared worker, this could involve different KV namespaces or higher-tier D1 bindings
        
        await init(); 
        const transformed = transform(JSON.stringify(data), JSON.stringify(rules))
        
        return c.json({ 
            success: true, 
            tier: sla.tier,
            priority: sla.priority,
            data: JSON.parse(transformed) 
        })
    } catch (e) {
        return c.json({ error: 'Transformation failed', details: e.message }, 500)
    }
})

// Directory: List & Search Agents (Ranking applied)
app.get('/api/directory/list', async (c) => {
    const capability = c.req.query('capability')
    const premiumOnly = c.req.query('premium') === 'true'
    const agents = await listAgents(c.env.AGNT_DB, { capability, premiumOnly })
    return c.json(agents)
})

// Directory: Update Agent Profile
app.post('/api/directory/update', async (c) => {
    const { agent_id, metadata } = await c.req.json()
    await updateAgentMetadata(c.env.AGNT_DB, agent_id, metadata)
    return c.json({ status: 'success' })
})

// Directory: Submit Review
app.post('/api/directory/review', async (c) => {
    const { target_id, reviewer_id, rating, comment } = await c.req.json()
    await submitReview(c.env.AGNT_DB, target_id, reviewer_id, rating, comment)
    return c.json({ status: 'success' })
})

export default {
    fetch: app.fetch,
    async scheduled(event, env, ctx) {
        ctx.waitUntil(settleBalances(env.AGNT_DB, env));
    }
}
