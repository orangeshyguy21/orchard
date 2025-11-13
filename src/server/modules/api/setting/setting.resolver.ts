/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Local Dependencies */
import {ApiSettingService} from './setting.service';
import {OrchardSetting} from './setting.model';

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
}
