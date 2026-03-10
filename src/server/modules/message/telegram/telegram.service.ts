/* Core Dependencies */
import {Injectable, Logger, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
/* Vendor Dependencies */
import {Bot} from 'grammy';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {SettingKey} from '@server/modules/setting/setting.enums';
import {UserService} from '@server/modules/user/user.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(TelegramService.name);
	private bot: Bot | null = null;

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
		Handlers
	******************************************************** */

	/** Register bot command handlers */
	private registerHandlers(): void {
		if (!this.bot) return;

		this.bot.command('start', async (ctx) => {
			const chat_id = ctx.chat.id.toString();
			await ctx.reply(
				`Welcome to Orchard!\n\nYour Telegram Chat ID is:\n\n${chat_id}\n\nEnter this in your Orchard user settings to link your account.`,
			);
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
