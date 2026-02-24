/* Core Dependencies */
import {Logger, UseInterceptors} from '@nestjs/common';
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
import {SettingKey} from '@server/modules/setting/setting.enums';
import {LogEvent} from '@server/modules/event/event.decorator';
import {EventLogType} from '@server/modules/event/event.enums';
/* Local Dependencies */
import {ApiSettingService} from './setting.service';
import {OrchardSetting} from './setting.model';
import {SettingInterceptor} from './setting.interceptor';

@Resolver()
export class SettingResolver {
	private readonly logger = new Logger(SettingResolver.name);

	constructor(private settingService: ApiSettingService) {}

	@Query(() => [OrchardSetting])
	async settings(): Promise<OrchardSetting[]> {
		const tag = 'GET { settings }';
		this.logger.debug(tag);
		return await this.settingService.getSettings(tag);
	}

	@Roles(UserRole.ADMIN)
	@UseInterceptors(SettingInterceptor)
	@LogEvent({
		type: EventLogType.UPDATE,
		field: 'setting',
		arg_keys: ['value'],
		old_value_key: 'value',
	})
	@Mutation(() => OrchardSetting)
	async setting_update(@Args('key', {type: () => SettingKey}) key: SettingKey, @Args('value') value: string): Promise<OrchardSetting> {
		const tag = 'UPDATE { setting }';
		this.logger.debug(tag);
		return await this.settingService.updateSetting(tag, key, value);
	}
}
