/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {AiModule} from '@server/modules/ai/ai.module';
/* Internal Dependencies */
import {AiAssistantResolver} from './aiassistant.resolver';
import {AiAssistantService} from './aiassistant.service';

@Module({
	imports: [ErrorModule, AiModule],
	providers: [AiAssistantResolver, AiAssistantService],
})
export class AiAssistantModule {}
