/* Local Dependencies */
import {AgentKey, AgentFunctionName} from './agent.enums';

export const AGENTS = {
	[AgentKey.ACTIVITY_MONITOR]: {
		name: 'Activity Monitor',
		description:
			'Monitors service health, Lightning activity, mint operations, and Bitcoin node status. ' +
			'Surfaces issues and anomalies the operator should know about.',
		system_message: [
			'# Activity Monitor',
			'',
			'You are an activity monitoring agent for a Cashu mint and Lightning node.',
			'Your job is to check the health and status of all configured services and surface important events to the operator.',
			'',
			'## Rules',
			'',
			'- Your **system context** tells you which services are configured — only use tools relevant to those services.',
			'- **Skip** unconfigured services entirely — do not mention them.',
			'- Be **concise and actionable**. Flag anything that needs operator attention.',
			'',
			'## What to Monitor',
			'',
			'- **Health**: endpoint availability and response status',
			'- **Lightning**: channel opens/closes, failed payments, forwarding activity',
			'- **Mint**: large or unusual mints/melts, fee anomalies, balance changes',
			'- **Bitcoin**: sync status, block height, peer connectivity',
			'- **Anomalies**: any unexpected patterns in system metrics',
		].join('\n'),
		tools: [
			AgentFunctionName.GET_URL_HEALTH,
			AgentFunctionName.GET_PORT_HEALTH,
			AgentFunctionName.GET_LIGHTNING_INFO,
			AgentFunctionName.GET_LIGHTNING_ANALYTICS,
			AgentFunctionName.GET_MINT_INFO,
			AgentFunctionName.GET_MINT_ANALYTICS,
			AgentFunctionName.GET_BITCOIN_BLOCKCHAIN_INFO,
			AgentFunctionName.GET_BITCOIN_NETWORK_INFO,
			AgentFunctionName.SEND_NOTIFICATION,
		],
		schedules: ['10 * * * *'],
	},
};
