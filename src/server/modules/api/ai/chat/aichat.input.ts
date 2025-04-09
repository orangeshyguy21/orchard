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
	model: string;

    @Field()
	agent: string;

	@Field(() => [AiChatMessageInput])
	messages: AiChatMessageInput[];
}
