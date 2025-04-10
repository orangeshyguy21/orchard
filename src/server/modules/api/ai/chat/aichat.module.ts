/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { AiModule } from "@server/modules/ai/ai.module";
/* Internal Dependencies */
import { AiChatResolver } from "./aichat.resolver";
import { AiChatService } from "./aichat.service";

@Module({
	imports: [
		ErrorModule,
		AiModule,
	],
	providers: [
		AiChatResolver,
		AiChatService,
	],
})
export class AiChatModule {}
