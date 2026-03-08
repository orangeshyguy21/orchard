/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	GraphQL Queries
******************************************************** */

const GET_LIGHTNING_INFO_QUERY = `
	query GetLightningInfo {
		lightning_info {
			version
			identity_pubkey
			alias
			color
			num_pending_channels
			num_active_channels
			num_inactive_channels
			num_peers
			block_height
			synced_to_chain
			synced_to_graph
			chains {
				chain
				network
			}
			uris
		}
	}
`;

const GET_LIGHTNING_ANALYTICS_QUERY = `
	query GetLightningAnalytics(
		$date_start: UnixTimestamp,
		$date_end: UnixTimestamp,
		$interval: AnalyticsInterval,
		$metrics: [LightningAnalyticsMetric!]
	) {
		lightning_analytics(
			date_start: $date_start,
			date_end: $date_end,
			interval: $interval,
			metrics: $metrics
		) {
			unit
			metric
			amount
			date
		}
	}
`;

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Fetches lightning network analytics with optional filters */
export const GetLightningAnalyticsTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_LIGHTNING_ANALYTICS,
			description:
				'Retrieve lightning network analytics for a given time range. ' +
				'Returns metrics like payments sent, invoices received, forward fees, ' +
				'channel opens/closes, and failed/pending payments. ' +
				'Amounts are in millisatoshis. Dates are unix timestamps in seconds.',
			parameters: {
				type: 'object',
				properties: {
					date_start: {
						type: 'number',
						description: 'Start of the time range as a unix timestamp in seconds. Defaults to 24 hours ago.',
					},
					date_end: {
						type: 'number',
						description: 'End of the time range as a unix timestamp in seconds. Defaults to now.',
					},
					interval: {
						type: 'string',
						description: 'The aggregation interval for bucketing analytics data.',
						enum: ['hour', 'day', 'week', 'month'],
					},
					metrics: {
						type: 'array',
						description: 'Which metrics to include. Defaults to all metrics if omitted.',
						items: {
							type: 'string',
							enum: [
								'payments_out',
								'payments_failed',
								'payments_pending',
								'invoices_in',
								'forward_fees',
								'channel_opens',
								'channel_closes',
								'channel_opens_remote',
								'channel_closes_remote',
							],
						},
					},
				},
			},
		},
	},
	query: GET_LIGHTNING_ANALYTICS_QUERY,
	throttle_max_calls: 15,
	throttle_window_seconds: 60,
};

/** Fetches lightning node identity and status information */
export const GetLightningInfoTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_LIGHTNING_INFO,
			description:
				'Retrieve information about the connected lightning node. ' +
				'Returns the node pubkey, alias, version, channel counts, ' +
				'sync status, network, and public URIs.',
			parameters: {
				type: 'object',
				properties: {},
			},
		},
	},
	query: GET_LIGHTNING_INFO_QUERY,
	throttle_max_calls: 10,
	throttle_window_seconds: 60,
};
