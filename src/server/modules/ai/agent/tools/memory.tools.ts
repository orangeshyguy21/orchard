/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	GraphQL Queries
******************************************************** */

const GET_PAST_RUNS_QUERY = `
	query GetPastRuns($agent_id: String!, $page: Int, $page_size: Int) {
		ai_agent_runs(agent_id: $agent_id, page: $page, page_size: $page_size) {
			status
			started_at
			completed_at
			result
		}
	}
`;

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Retrieves past run results so the agent can avoid repeating notifications */
export const GetPastRunsTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.GET_PAST_RUNS,
			description: [
				'Retrieve your own past run results as a memory log.',
				'',
				'Call this **first** at the start of every run to review what you previously reported.',
				'Use the `agent_id` from your runtime context.',
				'',
				'**Returns** (most recent first):',
				'- `status` — run outcome (`success` or `error`)',
				'- `started_at` / `completed_at` — unix timestamps',
				'- `result` — your previous internal notes (what you checked, found, and whether you notified)',
				'',
				'Cross-reference these notes before sending notifications to avoid repeating the same findings.',
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {
					agent_id: {
						type: 'string',
						description: 'Your agent ID (from runtime context).',
					},
					page: {
						type: 'integer',
						description: 'Page number (0 = most recent runs). Increase to look further into the past.',
					},
					page_size: {
						type: 'integer',
						description: 'Number of runs per page (default: 20).',
					},
				},
				required: ['agent_id'],
			},
		},
	},
	query: GET_PAST_RUNS_QUERY,
	throttle_max_calls: 3,
	throttle_window_seconds: 60,
};
