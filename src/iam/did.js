/**
 * AgntLayer IAM: Deterministic Identity Management
 * Uses Ed25519 (EdDSA) for Agent Identity verification.
 */

export async function verifyAgentSignature(publicKeyBase64, signatureBase64, data) {
    try {
        const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
        const signatureBuffer = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
        const dataBuffer = new TextEncoder().encode(data);

        const key = await crypto.subtle.importKey(
            'raw',
            publicKeyBuffer,
            { name: 'Ed25519', namedCurve: 'Ed25519' },
            true,
            ['verify']
        );

        return await crypto.subtle.verify(
            'Ed25519',
            key,
            signatureBuffer,
            dataBuffer
        );
    } catch (e) {
        console.error('IAM Verification Error:', e);
        return false;
    }
}

export async function registerDID(kv, agentId, publicKey) {
    // Store agentId -> publicKey mapping in KV
    await kv.put(`did:agnt:${agentId}`, JSON.stringify({
        publicKey,
        registeredAt: new Date().toISOString(),
        status: 'active'
    }));
}
