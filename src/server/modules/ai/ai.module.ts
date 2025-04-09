/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
/* Local Dependencies */
import { AiService } from './ai.service';

@Module({
	imports: [
		FetchModule,
	],
	providers: [
        AiService,
	],
	exports: [
        AiService,
	],
})
export class AiModule {}