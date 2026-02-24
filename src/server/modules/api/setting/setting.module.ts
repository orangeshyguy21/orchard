/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {EventLogModule} from '@server/modules/event/event.module';
import {SettingModule} from '@server/modules/setting/setting.module';
/* Local Dependencies */
import {SettingResolver} from './setting.resolver';
import {ApiSettingService} from './setting.service';
import {SettingInterceptor} from './setting.interceptor';

@Module({
	imports: [ErrorModule, EventLogModule, SettingModule],
	providers: [SettingResolver, ApiSettingService, SettingInterceptor],
})
export class ApiSettingModule {}
