/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {AiModule} from '@server/modules/ai/ai.module';
/* Internal Dependencies */
import {AiAgentResolver} from './aiagent.resolver';
import {AiAgentService} from './aiagent.service';

@Module({
	imports: [ErrorModule, AiModule],
	providers: [AiAgentResolver, AiAgentService],
})
export class AiAgentModule {}
