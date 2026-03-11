/* Core Dependencies */
import {Injectable, Logger, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
/* Vendor Dependencies */
import {Bot} from 'grammy';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {SettingKey} from '@server/modules/setting/setting.enums';
import {UserService} from '@server/modules/user/user.service';
/* Native Dependencies */
import {IncomingMessageHandler} from '@server/modules/message/message.types';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(TelegramService.name);
	private bot: Bot | null = null;
	private message_handler: IncomingMessageHandler | null = null;

	constructor(
		private readonly settingService: SettingService,
		private readonly userService: UserService,
	) {}

	/* *******************************************************
		Lifecycle
	******************************************************** */

	async onModuleInit(): Promise<void> {
		await this.initializeBot();
	}

	async onModuleDestroy(): Promise<void> {
		this.stopBot();
	}

	/* *******************************************************
		Bot Management
	******************************************************** */

	/** Initialize or re-initialize the bot from current settings */
	public async initializeBot(): Promise<void> {
		this.stopBot();
		const enabled = await this.settingService.getBooleanSetting(SettingKey.MESSAGES_ENABLED);
		if (!enabled) return;

		const vendor = await this.settingService.getStringSetting(SettingKey.MESSAGES_VENDOR);
		if (vendor !== 'telegram') return;

		const token = await this.settingService.getStringSetting(SettingKey.MESSAGES_TELEGRAM_BOT_TOKEN);
		if (!token) return;

		try {
			this.bot = new Bot(token);
			this.registerHandlers();
			this.bot.start({drop_pending_updates: true});
			this.logger.log('Telegram bot started (long-polling)');
		} catch (error) {
			this.logger.error(`Failed to start Telegram bot: ${error.message}`);
			this.bot = null;
		}
	}

	/** Stop the running bot gracefully */
	private stopBot(): void {
		if (this.bot) {
			this.bot.stop();
			this.bot = null;
		}
	}

	/* *******************************************************
		Incoming Messages
	******************************************************** */

	/** Register a callback to handle incoming user messages */
	public onMessage(handler: IncomingMessageHandler): void {
		this.message_handler = handler;
	}

	/* *******************************************************
		Handlers
	******************************************************** */

	/** Register bot command and message handlers */
	private registerHandlers(): void {
		if (!this.bot) return;

		this.bot.command('start', async (ctx) => {
			const chat_id = ctx.chat.id.toString();
			await ctx.reply(
				`Welcome to Orchard!\n\nYour Telegram Chat ID is:\n\n${chat_id}\n\nEnter this in your Orchard user settings to link your account.`,
			);
		});

		this.bot.on('message:text', async (ctx) => {
			if (ctx.message.text.startsWith('/')) return;
			const chat_id = ctx.chat.id.toString();
			const user = await this.userService.getUserByTelegramChatId(chat_id);
			if (!user) {
				await ctx.reply('Your Telegram account is not linked to an Orchard user. Use /start to get your Chat ID.');
				return;
			}
			if (!this.message_handler) return;
			try {
				await this.message_handler(chat_id, user.id, ctx.message.text);
			} catch (error) {
				this.logger.error(`Error handling incoming message from ${chat_id}: ${error.message}`);
				await ctx.reply('Something went wrong processing your message. Please try again.');
			}
		});

		this.bot.catch((error) => {
			this.logger.error(`Telegram bot error: ${error.message}`);
		});
	}

	/* *******************************************************
		Messaging
	******************************************************** */

	/** Send a message to a specific Telegram chat */
	public async sendMessage(chat_id: string, text: string): Promise<boolean> {
		if (!this.bot) return false;
		try {
			await this.bot.api.sendMessage(chat_id, text, {parse_mode: 'Markdown'});
			return true;
		} catch (error) {
			this.logger.error(`Failed to send Telegram message to ${chat_id}: ${error.message}`);
			return false;
		}
	}

	/** Send a notification to all users with linked Telegram accounts */
	public async broadcastNotification(title: string, body: string, severity: string): Promise<number> {
		if (!this.bot) return 0;

		const users = await this.userService.getUsersWithTelegramChatId();
		if (users.length === 0) return 0;

		const emoji = severity === 'critical' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';
		const message = `${emoji} *${title}*\n\n${body}`;

		let delivered_count = 0;
		for (const user of users) {
			const sent = await this.sendMessage(user.telegram_chat_id!, message);
			if (sent) delivered_count++;
		}

		this.logger.log(`Telegram notification broadcast: ${delivered_count}/${users.length} delivered`);
		return delivered_count;
	}

	/** Check if the bot is currently running */
	public isRunning(): boolean {
		return this.bot !== null;
	}
}
