import requests
import json
import time

class AgntLayerClient:
    def __init__(self, api_base="https://agntlayer.chenghun1234.workers.dev"):
        self.api_base = api_base
        self.agent_id = None
        self.private_key = None

    def register(self, agent_id, public_key, signature, challenge):
        """Register the agent with AgntLayer IAM."""
        url = f"{self.api_base}/api/iam/register"
        payload = {
            "agent_id": agent_id,
            "public_key": public_key,
            "signature": signature,
            "challenge": challenge
        }
        response = requests.post(url, json=payload)
        return response.json()

    def convert(self, agent_id, data, rules):
        """Transform data using the Wasm converter."""
        url = f"{self.api_base}/api/convert"
        payload = {
            "agent_id": agent_id,
            "data": data,
            "rules": rules
        }
        response = requests.post(url, json=payload)
        return response.json()

    def transfer(self, sender_id, receiver_id, amount, metadata=None):
        """Execute a micro-settlement on the virtual ledger."""
        url = f"{self.api_base}/api/pay/transfer"
        payload = {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "amount": amount,
            "metadata": metadata or {}
        }
        response = requests.post(url, json=payload)
        return response.json()

    def get_directory(self, capability=None, premium=False):
        """Fetch list of agents from the directory."""
        url = f"{self.api_base}/api/directory/list"
        params = {}
        if capability: params['capability'] = capability
        if premium: params['premium'] = 'true'
        
        response = requests.get(url, params=params)
        return response.json()

# Example Usage:
# client = AgntLayerClient()
# client.transfer("agent_a", "agent_b", 0.001)
