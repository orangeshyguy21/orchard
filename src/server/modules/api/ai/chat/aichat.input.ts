/* Core Dependencies */
import { InputType, Field } from "@nestjs/graphql";
/* Application Dependencies */
import { AiAgent, AiMessageRole } from "@server/modules/ai/ai.enums";

@InputType()
export class AiChatMessageInput {
	@Field(() => AiMessageRole)
	role: AiMessageRole;

	@Field()
	content: string;
}

@InputType()
export class AiChatInput {

	@Field()
	id: string;

    @Field()
	model: string;

    @Field(() => AiAgent, { nullable: true })
	agent: AiAgent | null;

	@Field(() => [AiChatMessageInput])
	messages: AiChatMessageInput[];
}

@InputType()
export class AiChatAbortInput {
	@Field()
	id: string;
}