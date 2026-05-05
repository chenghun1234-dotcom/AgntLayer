# AgntLayer (Agent-Protocol.io)

The Standard Infrastructure for Agent-to-Agent Economy.

## Vision
AgntLayer is a deterministic, zero-cost gateway designed for the autonomous agent economy. It provides the essential infrastructure for Identity (IAM), Payment (Settlement), and Communication (Converter).

## Key Features
- **Deterministic IAM**: Ed25519-based decentralized identifiers. No AI models, just math.
- **Off-chain Ledger**: Sub-penny micro-settlements using Cloudflare D1.
- **Schema Mapping**: Ultra-fast Rust/Wasm based data transformation between agents.
- **Zero Operating Cost**: Built entirely on Cloudflare's serverless edge.

## Tech Stack
- **Compute**: Cloudflare Workers (Hono)
- **Database**: Cloudflare D1
- **KV Store**: Cloudflare KV
- **Security**: Web Crypto API (Ed25519)
- **Frontend**: Vanilla HTML/CSS/JS (SEO Optimized)

## Setup
1. `npm install`
2. Configure `wrangler.toml` with your Cloudflare IDs.
3. Run `npm run dev` to test locally.

## SEO Keywords
Agent IAM, M2M Payment Infrastructure, Autonomous Agent Communication, Micro-settlement API, AI Agent Protocol.
