/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {AiToolsResolver} from './aitools.resolver';
import {AiToolsService} from './aitools.service';

@Module({
	providers: [AiToolsResolver, AiToolsService],
})
export class AiToolsModule {}
