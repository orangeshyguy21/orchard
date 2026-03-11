/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
/* Local Dependencies */
import {TelegramService} from './telegram/telegram.service';
import {IncomingMessageHandler} from './message.types';

/** Result of a message broadcast across all vendors */
export type MessageResult = {
	delivered: Record<string, number>;
	total: number;
};

@Injectable()
export class MessageService implements OnModuleInit {
	private readonly logger = new Logger(MessageService.name);
	private message_handler: IncomingMessageHandler | null = null;

	constructor(private readonly telegramService: TelegramService) {}

	async onModuleInit(): Promise<void> {
		this.telegramService.onMessage(async (chat_id, user_id, text) => {
			if (!this.message_handler) return;
			await this.message_handler(chat_id, user_id, text);
		});
	}

	/* *******************************************************
		Incoming Messages
	******************************************************** */

	/** Register a callback to handle incoming user messages */
	public onMessage(handler: IncomingMessageHandler): void {
		this.message_handler = handler;
	}

	/* *******************************************************
		Reply
	******************************************************** */

	/** Send a reply to a specific chat via the active vendor */
	public async sendReply(chat_id: string, text: string): Promise<boolean> {
		if (this.telegramService.isRunning()) {
			return this.telegramService.sendMessage(chat_id, text);
		}
		return false;
	}

	/* *******************************************************
		Broadcast
	******************************************************** */

	/**
	 * Broadcast a message across all enabled vendors.
	 * Returns delivery counts per vendor and total.
	 */
	public async broadcast(title: string, body: string, severity: string): Promise<MessageResult> {
		const delivered: Record<string, number> = {};
		let total = 0;

		/* Telegram */
		if (this.telegramService.isRunning()) {
			const count = await this.telegramService.broadcastNotification(title, body, severity);
			delivered['telegram'] = count;
			total += count;
		}

		/* Future vendors go here */

		this.logger.log(`Message broadcast: ${total} total delivered (${JSON.stringify(delivered)})`);
		return {delivered, total};
	}

	/** Reinitialize all vendor services (e.g. after settings change) */
	public async reinitialize(): Promise<void> {
		await this.telegramService.initializeBot();
	}
}
