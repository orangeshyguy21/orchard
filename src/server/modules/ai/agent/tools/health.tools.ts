/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	GraphQL Queries
******************************************************** */

const GET_PUBLIC_URLS_QUERY = `
	query GetPublicUrls($urls: [String!]!) {
		public_urls(urls: $urls) {
			url
			status
			ip_address
			has_data
		}
	}
`;

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Checks liveness of public endpoints by URL */
export const GetHealthTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_HEALTH,
			description:
				'Checks the liveness of public endpoints. ' +
				'Fetches each URL and returns the HTTP status code, resolved IP address, ' +
				'and whether the endpoint returned valid data.',
			parameters: {
				type: 'object',
				properties: {
					urls: {
						type: 'array',
						description: 'List of URLs to check for liveness.',
						items: {
							type: 'string',
						},
					},
				},
				required: ['urls'],
			},
		},
	},
	query: GET_PUBLIC_URLS_QUERY,
	throttle_max_calls: 10,
	throttle_window_seconds: 60,
};
