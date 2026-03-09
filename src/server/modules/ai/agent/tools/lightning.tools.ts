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
			description: [
				'Retrieve Lightning network activity metrics for a time range.',
				'',
				'**Returns** (per metric per interval bucket):',
				'- `metric` — the metric name',
				'- `amount` — value in **millisatoshis** (1 sat = 1,000 msat)',
				'- `date` — bucket timestamp (unix seconds)',
				'- `unit` — currency unit',
				'',
				'**Available metrics:**',
				'- `payments_out` — outgoing payments sent',
				'- `invoices_in` — incoming payments received',
				'- `forward_fees` — fees earned from routing',
				'- `payments_failed` / `payments_pending` — unsuccessful or in-flight payments',
				'- `channel_opens` / `channel_closes` — locally-initiated channel events',
				'- `channel_opens_remote` / `channel_closes_remote` — remotely-initiated channel events',
				'',
				'**Interpretation:**',
				'- High `payments_failed` relative to `payments_out` indicates routing or liquidity problems',
				'- `channel_closes_remote` spikes may indicate force-closes by peers — always flag these',
				'- Sudden drops in `forward_fees` may signal loss of routing position',
				"- Use `interval: 'hour'` for recent activity, `'day'` or `'week'` for trends",
				'',
				'**Defaults:** `date_start` = all time (epoch 0), `date_end` = now, `metrics` = all. Always provide a `date_start` to scope results.',
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {
					date_start: {
						type: 'number',
						description:
							'Start of the time range as a unix timestamp in seconds. Defaults to 0 (all time). You should always set this.',
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
			description: [
				'Retrieve Lightning node identity and operational status.',
				'',
				'**Returns:**',
				'- `identity_pubkey` / `alias` / `color` — node identity',
				'- `version` — LN implementation version',
				'- `num_active_channels` / `num_inactive_channels` / `num_pending_channels` — channel counts by state',
				'- `num_peers` — connected peer count',
				'- `synced_to_chain` / `synced_to_graph` — whether the node is caught up',
				'- `block_height` — latest block the LN node is aware of',
				'- `uris` — public connection URIs',
				'',
				'**Interpretation:**',
				'- `synced_to_chain: false` or `synced_to_graph: false` means the node is not fully operational',
				'- Inactive channels > 0 may indicate peers are offline or channels are stuck',
				'- Pending channels > 0 means channels are waiting for on-chain confirmation',
				'- Zero active channels means the node cannot route or send payments',
			].join('\n'),
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
