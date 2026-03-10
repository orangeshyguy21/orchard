/* Core Dependencies */
import {Logger} from '@nestjs/common';

/* Application Dependencies */
import {NotificationService} from '@server/modules/notification/notification.service';

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

/** Creates a notification tool with optional vendor delivery via NotificationService */
export function createSendNotificationTool(notificationService?: NotificationService): AiToolEntry {
	return {
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
							description:
								'Short summary of the notification (e.g. "Channel Force-Closed", "Mint Balance Mismatch").',
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

			let notification_delivered = 0;
			let notification_channels: Record<string, number> = {};

			if (notificationService) {
				const result = await notificationService.broadcast(title, body, severity);
				notification_delivered = result.total;
				notification_channels = result.delivered;
			}

			logger.log(`Notification [${severity.toUpperCase()}] "${title}" — ${notification_delivered} delivered`);

			return {
				success: true,
				data: {
					delivered: notification_delivered > 0,
					notification_delivered,
					notification_channels,
				},
			};
		},
		throttle_max_calls: 1,
		throttle_window_seconds: 60,
	};
}
