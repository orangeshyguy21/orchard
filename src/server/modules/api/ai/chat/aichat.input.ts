/* Core Dependencies */
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AiChatMessageInput {
	@Field()
	role: string;

	@Field()
	content: string;
}

@InputType()
export class AiChatInput {

	@Field()
	id: string;

    @Field()
	model: string;

    @Field()
	agent: string;

	@Field(() => [AiChatMessageInput])
	messages: AiChatMessageInput[];
}

@InputType()
export class AiChatAbortInput {
	@Field()
	id: string;
}