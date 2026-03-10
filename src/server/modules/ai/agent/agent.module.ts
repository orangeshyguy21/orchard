/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
/* Application Dependencies */
import {AiModule} from '@server/modules/ai/ai.module';
import {NotificationModule} from '@server/modules/notification/notification.module';
import {SettingModule} from '@server/modules/setting/setting.module';
/* Local Dependencies */
import {Agent} from './agent.entity';
import {AgentRun} from './agent-run.entity';
import {AgentService} from './agent.service';
import {ToolService} from '@server/modules/ai/tools/tool.service';

@Module({
	imports: [TypeOrmModule.forFeature([Agent, AgentRun]), AiModule, NotificationModule, SettingModule],
	providers: [AgentService, ToolService],
	exports: [AgentService],
})
export class AgentModule {}
