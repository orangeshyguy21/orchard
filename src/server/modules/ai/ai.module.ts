/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {FetchModule} from '@server/modules/fetch/fetch.module';
import {SettingModule} from '@server/modules/setting/setting.module';
/* Local Dependencies */
import {AiService} from './ai.service';
import {OllamaService} from './ollama/ollama.service';
import {OpenRouterService} from './openrouter/openrouter.service';

@Module({
	imports: [FetchModule, SettingModule],
	providers: [AiService, OllamaService, OpenRouterService],
	exports: [AiService],
})
export class AiModule {}
