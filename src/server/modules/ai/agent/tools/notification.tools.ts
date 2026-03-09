/* Core Dependencies */
import {Logger} from '@nestjs/common';

/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	Logger
******************************************************** */

const logger = new Logger('AgentNotification');

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Sends a notification to the user about an important event */
export const SendNotificationTool: AiToolEntry = {
	tool: {
		type: 'function',
		function: {
			name: AgentFunctionName.SEND_NOTIFICATION,
			description: [
				'Send a notification to the operator.',
				'',
				'**Severity levels:**',
				'- `info` — noteworthy but not urgent',
				'- `warning` — potential issue that may need attention',
				'- `critical` — requires immediate action',
			].join('\n'),
			parameters: {
				type: 'object',
				properties: {
					title: {
						type: 'string',
						description: 'Short summary of the notification (e.g. "Channel Force-Closed", "Mint Balance Mismatch").',
					},
					body: {
						type: 'string',
						description: 'Detailed explanation of what was observed and why it matters.',
					},
					severity: {
						type: 'string',
						enum: ['info', 'warning', 'critical'],
						description:
							'The severity level: "info" for noteworthy events, "warning" for potential issues, "critical" for urgent problems.',
					},
				},
				required: ['title', 'body', 'severity'],
			},
		},
	},
	handler: async (args: Record<string, unknown>) => {
		const title = args.title as string;
		const body = args.body as string;
		const severity = args.severity as string;

		const label = severity.toUpperCase();
		const divider = '─'.repeat(60);

		logger.log(`\n${divider}`);
		logger.log(`🔔 [${label}] ${title}`);
		logger.log(body);
		logger.log(divider);

		return {success: true, data: {delivered: true, channel: 'console'}};
	},
	throttle_max_calls: 1,
	throttle_window_seconds: 60,
};
