/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	GraphQL Queries
******************************************************** */

const GET_MINT_ANALYTICS_QUERY = `
	query GetMintAnalytics(
		$units: [MintUnit!],
		$date_start: UnixTimestamp,
		$date_end: UnixTimestamp,
		$interval: AnalyticsInterval
	) {
		balances: mint_analytics_balances(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval) {
			unit
			amount
			date
			count
		}
		mints: mint_analytics_mints(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval) {
			unit
			amount
			date
			count
		}
		melts: mint_analytics_melts(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval) {
			unit
			amount
			date
			count
		}
		fees: mint_analytics_fees(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval) {
			unit
			amount
			date
			count
		}
	}
`;

const GET_MINT_INFO_QUERY = `
	query GetMintInfo {
		mint_info {
			name
			pubkey
			version
			description
			description_long
			contact {
				method
				info
			}
			icon_url
			urls
		}
	}
`;

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Fetches cashu mint identity and configuration information */
export const GetMintInfoTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_MINT_INFO,
			description: [
				'Retrieve Cashu mint identity and configuration.',
				'',
				'**Returns:**',
				'- `name` / `description` / `description_long` — mint branding and info',
				"- `pubkey` — the mint's public key",
				'- `version` — mint software version',
				'- `contact` — operator contact methods (e.g. email, nostr)',
				'- `icon_url` — mint icon URL',
				'- `urls` — public endpoint URLs (can be passed to GET_URL_HEALTH for liveness checks)',
				'',
				"**Usage:** Call this first to discover the mint's public URLs, then verify them with GET_URL_HEALTH.",
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {},
			},
		},
	},
	query: GET_MINT_INFO_QUERY,
	throttle_max_calls: 10,
	throttle_window_seconds: 60,
};

/** Fetches mint analytics for balances, mints, melts, and fees */
export const GetMintAnalyticsTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_MINT_ANALYTICS,
			description: [
				'Retrieve Cashu mint operational metrics for a time range.',
				'',
				'**Returns** four metric categories, each with `unit`, `amount`, `date`, `count`:',
				'- `balances` — outstanding token supply (ecash in circulation)',
				'- `mints` — tokens issued (Lightning → ecash conversions)',
				'- `melts` — tokens redeemed (ecash → Lightning conversions)',
				'- `fees` — fees collected from mint/melt operations',
				'',
				'**Interpretation:**',
				'- A large balance increase without corresponding mints may indicate an accounting anomaly',
				'- Unusually large individual mints or melts (high amount, low count) should be flagged',
				'- Fee revenue dropping while volume stays steady could signal a configuration change',
				'- Compare `mints` vs `melts` to assess net flow direction',
				'',
				'**Defaults:** `date_start` = all time (epoch 0), `date_end` = now, `units` = all. Always provide a `date_start` to scope results.',
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {
					units: {
						type: 'array',
						description: 'Filter by currency units. Defaults to all units if omitted.',
						items: {
							type: 'string',
							enum: ['sat', 'msat', 'usd', 'eur', 'btc'],
						},
					},
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
	query: GET_MINT_ANALYTICS_QUERY,
	throttle_max_calls: 15,
	throttle_window_seconds: 60,
};
