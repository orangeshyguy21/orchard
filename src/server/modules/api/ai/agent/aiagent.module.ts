/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {AgentModule} from '@server/modules/ai/agent/agent.module';
/* Local Dependencies */
import {AiAgentResolver} from './aiagent.resolver';
import {AiAgentService} from './aiagent.service';

@Module({
	imports: [AgentModule, ErrorModule],
	providers: [AiAgentResolver, AiAgentService],
})
export class AiAgentModule {}
