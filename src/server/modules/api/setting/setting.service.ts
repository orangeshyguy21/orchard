/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {SettingKey} from '@server/modules/setting/setting.enums';
import {NotificationService} from '@server/modules/notification/notification.service';
/* Local Dependencies */
import {OrchardSetting} from './setting.model';

/** Setting keys that require notification service reinitalization when changed */
const NOTIFICATION_KEYS = new Set<SettingKey>([
	SettingKey.NOTIFICATIONS_ENABLED,
	SettingKey.NOTIFICATIONS_VENDOR,
	SettingKey.NOTIFICATIONS_TELEGRAM_BOT_TOKEN,
]);

@Injectable()
export class ApiSettingService {
	private readonly logger = new Logger(ApiSettingService.name);

	constructor(
		private settingService: SettingService,
		private errorService: ErrorService,
		private notificationService: NotificationService,
	) {}

	async getSettings(tag: string): Promise<OrchardSetting[]> {
		try {
			const settings = await this.settingService.getSettings();
			return settings.map((setting) => new OrchardSetting(setting));
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.SettingError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	async updateSettings(tag: string, keys: SettingKey[], values: string[]): Promise<OrchardSetting[]> {
		try {
			if (keys.length !== values.length) throw OrchardErrorCode.SettingError;
			const settings = await this.settingService.updateSettings(keys, values);
			if (keys.some((key) => NOTIFICATION_KEYS.has(key))) {
				await this.notificationService.reinitialize();
			}
			return settings.map((setting) => new OrchardSetting(setting));
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.SettingError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
