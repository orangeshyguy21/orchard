/* Core Dependencies */
import {Logger} from '@nestjs/common';

/* Application Dependencies */
import {MessageService} from '@server/modules/message/message.service';

/* Local Dependencies */
import {AgentFunctionName} from '../agent.enums';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';

/* *******************************************************
	Logger
******************************************************** */

const logger = new Logger('AgentMessage');

/* *******************************************************
	Tool Definitions
******************************************************** */

/** Creates a message tool with optional vendor delivery via MessageService */
export function createSendMessageTool(messageService?: MessageService): AiToolEntry {
	return {
		tool: {
			type: 'function',
			function: {
				name: AgentFunctionName.SEND_MESSAGE,
				description: [
					'Send a message to the operator.',
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
							description:
								'Short summary of the message (e.g. "Channel Force-Closed", "Mint Balance Mismatch").',
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

			let message_delivered = 0;
			let message_channels: Record<string, number> = {};

			if (messageService) {
				const result = await messageService.broadcast(title, body, severity);
				message_delivered = result.total;
				message_channels = result.delivered;
			}

			logger.log(`Message [${severity.toUpperCase()}] "${title}" — ${message_delivered} delivered`);

			return {
				success: true,
				data: {
					delivered: message_delivered > 0,
					message_delivered,
					message_channels,
				},
			};
		},
		throttle_max_calls: 1,
		throttle_window_seconds: 60,
	};
}
