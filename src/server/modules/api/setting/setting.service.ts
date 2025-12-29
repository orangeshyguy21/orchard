/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {SettingKey} from '@server/modules/setting/setting.enums';
/* Local Dependencies */
import {OrchardSetting} from './setting.model';

@Injectable()
export class ApiSettingService {
	private readonly logger = new Logger(ApiSettingService.name);

	constructor(
		private settingService: SettingService,
		private errorService: ErrorService,
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

	async updateSetting(tag: string, key: SettingKey, value: string): Promise<OrchardSetting> {
		try {
			const setting = await this.settingService.updateSetting(key, value);
			return new OrchardSetting(setting);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.SettingError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
