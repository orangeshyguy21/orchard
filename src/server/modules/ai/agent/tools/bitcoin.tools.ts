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
			description:
				'Retrieve bitcoin network information from the connected node. ' +
				'Returns version, peer connections, reachable networks, ' +
				'local addresses, and any warnings.',
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
			description:
				'Retrieve bitcoin blockchain information from the connected node. ' +
				'Returns the chain name, block height, headers, difficulty, ' +
				'sync progress, disk usage, pruning status, and any warnings.',
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
