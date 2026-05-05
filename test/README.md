# AgntLayer Testing & Demo

This directory contains scripts to test the AgntLayer infrastructure.

## Prerequisites
- Node.js installed
- Cloudflare Wrangler (`npm install -g wrangler`)
- `npm install` in the root directory

## How to Run Demo
1. Start the local development server:
   ```bash
   npx wrangler dev
   ```
2. In another terminal, run the demo script:
   ```bash
   node test/demo_agent.js
   ```

## API Testing (via cURL)

### 1. Register Agent
```bash
curl -X POST http://localhost:8787/api/iam/register \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "0x123", "public_key": "...", "signature": "...", "challenge": "..."}'
```

### 2. Schema Transformation
```bash
curl -X POST http://localhost:8787/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "0x123",
    "data": {"foo": "bar"},
    "rules": {"target": "foo"}
  }'
```

### 3. List Directory
```bash
curl http://localhost:8787/api/directory/list?premium=true
```
