/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Local Dependencies */
import {TelegramService} from './telegram/telegram.service';

/** Result of a notification broadcast across all vendors */
export type NotificationResult = {
	delivered: Record<string, number>;
	total: number;
};

@Injectable()
export class NotificationService {
	private readonly logger = new Logger(NotificationService.name);

	constructor(private readonly telegramService: TelegramService) {}

	/* *******************************************************
		Broadcast
	******************************************************** */

	/**
	 * Broadcast a notification across all enabled vendors.
	 * Returns delivery counts per vendor and total.
	 */
	public async broadcast(title: string, body: string, severity: string): Promise<NotificationResult> {
		const delivered: Record<string, number> = {};
		let total = 0;

		/* Telegram */
		if (this.telegramService.isRunning()) {
			const count = await this.telegramService.broadcastNotification(title, body, severity);
			delivered['telegram'] = count;
			total += count;
		}

		/* Future vendors go here */

		this.logger.log(`Notification broadcast: ${total} total delivered (${JSON.stringify(delivered)})`);
		return {delivered, total};
	}

	/** Reinitialize all vendor services (e.g. after settings change) */
	public async reinitialize(): Promise<void> {
		await this.telegramService.initializeBot();
	}
}
