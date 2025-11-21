/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {SettingModule} from '@server/modules/setting/setting.module';
/* Local Dependencies */
import {SettingResolver} from './setting.resolver';
import {ApiSettingService} from './setting.service';

@Module({
	imports: [ErrorModule, SettingModule],
	providers: [SettingResolver, ApiSettingService],
})
export class ApiSettingModule {}
