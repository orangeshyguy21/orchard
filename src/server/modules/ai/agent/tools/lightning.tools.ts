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

const GET_LIGHTNING_ANALYTICS_BALANCES_QUERY = `
	query GetLightningAnalyticsBalances(
		$date_start: UnixTimestamp,
		$date_end: UnixTimestamp,
		$interval: AnalyticsInterval
	) {
		local_balance: lightning_analytics_local_balance(
			date_start: $date_start,
			date_end: $date_end,
			interval: $interval
		) {
			unit
			amount
			date
		}
		remote_balance: lightning_analytics_remote_balance(
			date_start: $date_start,
			date_end: $date_end,
			interval: $interval
		) {
			unit
			amount
			date
		}
	}
`;

const GET_LIGHTNING_ANALYTICS_METRICS_QUERY = `
	query GetLightningAnalyticsMetrics(
		$date_start: UnixTimestamp,
		$date_end: UnixTimestamp,
		$interval: AnalyticsInterval,
		$metrics: [LightningAnalyticsMetric!]
	) {
		lightning_analytics_metrics(
			date_start: $date_start,
			date_end: $date_end,
			interval: $interval,
			metrics: $metrics
		) {
			unit
			metric
			amount
			date
			count
		}
	}
`;

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Fetches lightning balance analytics (local + remote) */
export const GetLightningAnalyticsBalancesTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_LIGHTNING_ANALYTICS_BALANCES,
			description: [
				'Retrieve Lightning channel balance analytics for a time range.',
				'',
				'**Returns** two derived balance categories, each with `unit`, `amount`, `date`:',
				'- `local_balance` — net local (outbound) capacity change per interval',
				'  Formula: channel_opens + invoices_in + forward_fees - payments_out - channel_closes',
				'- `remote_balance` — net remote (inbound) capacity change per interval',
				'  Formula: channel_opens_remote + payments_out - invoices_in - forward_fees - channel_closes_remote',
				'',
				'Amounts are in **millisatoshis** (1 sat = 1,000 msat).',
				'',
				'**Interpretation:**',
				'- Sustained negative `local_balance` means outbound liquidity is draining',
				'- `remote_balance` growth indicates increasing inbound capacity',
				'- Compare both to assess overall channel health and rebalancing needs',
				"- Use `interval: 'day'` or `'week'` for trend analysis",
				'',
				'**Defaults:** `date_start` = all time, `date_end` = now. Always provide a `date_start` to scope results.',
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
				},
			},
		},
	},
	query: GET_LIGHTNING_ANALYTICS_BALANCES_QUERY,
	throttle_max_calls: 15,
	throttle_window_seconds: 60,
};

/** Fetches lightning per-metric analytics with optional filters */
export const GetLightningAnalyticsMetricsTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_LIGHTNING_ANALYTICS_METRICS,
			description: [
				'Retrieve raw Lightning network activity metrics for a time range.',
				'',
				'**Returns** per metric per interval bucket: `unit`, `metric`, `amount`, `date`, `count`.',
				'Amounts are in **millisatoshis** (1 sat = 1,000 msat).',
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
				'- Use `count` to distinguish many small transactions from few large ones',
				"- Use `interval: 'hour'` for recent activity, `'day'` or `'week'` for trends",
				'',
				'**Defaults:** `date_start` = all time, `date_end` = now, `metrics` = all. Always provide a `date_start` to scope results.',
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
	query: GET_LIGHTNING_ANALYTICS_METRICS_QUERY,
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
