/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	GraphQL Queries
******************************************************** */

const GET_BITCOIN_NETWORK_INFO_QUERY = `
	query GetBitcoinNetworkInfo {
		bitcoin_network_info {
			version
			subversion
			protocolversion
			connections
			connections_in
			connections_out
			networkactive
			networks {
				name
				reachable
			}
			localaddresses {
				address
				port
			}
			warnings
		}
	}
`;

const GET_BITCOIN_BLOCKCHAIN_INFO_QUERY = `
	query GetBitcoinBlockchainInfo {
		bitcoin_blockchain_info {
			chain
			blocks
			headers
			bestblockhash
			difficulty
			verificationprogress
			initialblockdownload
			size_on_disk
			pruned
			warnings
		}
	}
`;

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Fetches bitcoin network peer and connectivity information */
export const GetBitcoinNetworkInfoTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_BITCOIN_NETWORK_INFO,
			description: [
				'Retrieve Bitcoin node network and peer connectivity information.',
				'',
				'**Returns:**',
				'- `connections` / `connections_in` / `connections_out` — total, inbound, and outbound peer count',
				'- `networkactive` — whether networking is enabled',
				'- `networks` — list of network types (ipv4, ipv6, onion) and their reachability',
				'- `localaddresses` — addresses the node advertises to peers',
				'- `warnings` — any active warnings from the node',
				'',
				'**Interpretation:**',
				'- Zero connections or `networkactive: false` is critical — the node is isolated',
				'- Very low outbound connections (< 4) may indicate network issues',
				'- Non-empty `warnings` should always be surfaced to the operator',
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {},
			},
		},
	},
	query: GET_BITCOIN_NETWORK_INFO_QUERY,
	throttle_max_calls: 10,
	throttle_window_seconds: 60,
};

/** Fetches bitcoin blockchain sync and chain state information */
export const GetBitcoinBlockchainInfoTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_BITCOIN_BLOCKCHAIN_INFO,
			description: [
				'Retrieve Bitcoin blockchain sync status and chain state.',
				'',
				'**Returns:**',
				'- `chain` — network name (e.g. "main", "test", "regtest")',
				'- `blocks` / `headers` — synced block height vs. known header height',
				'- `verificationprogress` — sync progress from 0.0 to 1.0 (1.0 = fully synced)',
				'- `initialblockdownload` — `true` if still performing initial sync (IBD)',
				'- `size_on_disk` — blockchain data size in bytes',
				'- `pruned` — whether the node is pruning old blocks',
				'- `warnings` — any active warnings',
				'',
				'**Interpretation:**',
				'- `blocks` significantly behind `headers` means the node is still syncing',
				'- `initialblockdownload: true` means the node is not yet operational',
				'- `verificationprogress` below 0.9999 during normal operation is a concern',
				'- Non-empty `warnings` should always be surfaced',
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {},
			},
		},
	},
	query: GET_BITCOIN_BLOCKCHAIN_INFO_QUERY,
	throttle_max_calls: 10,
	throttle_window_seconds: 60,
};
