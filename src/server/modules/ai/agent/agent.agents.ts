/* Local Dependencies */
import {AgentKey, AgentFunctionName} from './agent.enums';

export const AGENTS = {
	[AgentKey.ACTIVITY_MONITOR]: {
		name: 'Activity Monitor',
		description: 'Watches for key activity: channel opens and closes, failed payments, and traffic anomalies',
		system_message:
			'You are an activity monitoring agent for a Cashu mint and Lightning node. ' +
			'Your job is to analyze recent activity and surface important events that the operator should know about. ' +
			'Focus on channel opens and closes, failed Lightning payments, unusual traffic patterns, and any anomalies in system metrics. ' +
			'Be concise and actionable in your reports.',
		tools: [AgentFunctionName.GET_LIGHTNING_ANALYTICS],
		schedules: ['10 * * * *'],
	},
};
