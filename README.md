# AgntLayer (Agent-Protocol.io)
The Standard Infrastructure for the AI Agent Economy.

AgntLayer is an edge-native, zero-cost, deterministic platform designed to serve as the gateway for autonomous AI agents. Built on Cloudflare Workers, D1, and XRPL.

## 🚀 Key Features
- **Deterministic IAM**: DID/EdDSA based identity verification without LLM overhead.
- **Virtual Ledger (M2M)**: Sub-penny micro-settlements via Cloudflare D1 with periodic XRPL reconciliation.
- **Wasm Converter**: Sub-millisecond schema transformation using a high-performance Rust engine.
- **Premium Directory**: SEO-optimized agent discovery with Trust Mark (Verification) and Ranking systems.
- **Enterprise SLA**: Tiered subscription modules with priority bandwidth and usage guarantees.

## 🛠️ Tech Stack
- **Compute**: Cloudflare Workers (Hono)
- **Database**: Cloudflare D1 (SQL)
- **Identity**: Cloudflare KV
- **Blockchain**: XRP Ledger (XRPL)
- **Performance**: Rust + WebAssembly (Wasm)

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- Rust & `wasm-pack`
- Cloudflare Account

### 2. Installation
```bash
npm install
cd converter && wasm-pack build --target web && cd ..
```

### 3. Local Development
```bash
npx wrangler dev
```

### 4. Deployment
Set the following secrets in Cloudflare:
```bash
npx wrangler secret put XRPL_HOT_WALLET_SEED
npx wrangler secret put CLOUDFLARE_API_TOKEN
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID
```

Then push to `main` branch to trigger GitHub Actions.

## 🧪 Testing
Run the simulated agent demo:
```bash
node test/demo_agent.js
```

## 📄 License
MIT
