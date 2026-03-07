/* Core Dependencies */
import {InputType, Field} from '@nestjs/graphql';
/* Application Dependencies */
import {AiAssistant} from '@server/modules/ai/assistant/ai.assistant.enums';
import {AiMessageRole} from '@server/modules/ai/ai.enums';

@InputType()
export class AiChatMessageInput {
	@Field(() => AiMessageRole)
	role: AiMessageRole;

	@Field()
	content: string;

	@Field({nullable: true})
	thinking: string;
}

@InputType()
export class AiChatInput {
	@Field()
	id: string;

	@Field()
	model: string;

	@Field()
	auth: string;

	@Field(() => AiAssistant, {nullable: true})
	assistant: AiAssistant | null;

	@Field(() => [AiChatMessageInput])
	messages: AiChatMessageInput[];
}
