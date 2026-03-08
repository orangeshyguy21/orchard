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
			description:
				'Retrieve information about the connected cashu mint. ' +
				'Returns the mint name, pubkey, version, description, ' +
				'contact info, and public URLs.',
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
			description:
				'Retrieve mint analytics for a given time range. ' +
				'Returns balances, mints (tokens issued), melts (tokens redeemed), and fees. ' +
				'Each metric includes unit, amount, date, and count. Dates are unix timestamps in seconds.',
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
				},
			},
		},
	},
	query: GET_MINT_ANALYTICS_QUERY,
	throttle_max_calls: 15,
	throttle_window_seconds: 60,
};
