/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {AiToolCall, AiMessage, AiStreamChunk, AiStreamUsage} from '@server/modules/ai/ai.types';
import {AiMessageRole, AiFunctionName} from '@server/modules/ai/ai.enums';

@ObjectType()
export class OrchardAiChatFunction {
	@Field(() => AiFunctionName)
	name: AiFunctionName;

	@Field()
	arguments: string;

	constructor(funct: AiToolCall['function']) {
		this.name = funct.name;
		this.arguments = JSON.stringify(funct.arguments);
	}
}

@ObjectType()
export class OrchardAiChatToolCall {
	@Field(() => OrchardAiChatFunction)
	function: OrchardAiChatFunction;

	constructor(tool_call: AiToolCall) {
		this.function = new OrchardAiChatFunction(tool_call.function);
	}
}

@ObjectType()
export class OrchardAiChatMessage {
	@Field(() => AiMessageRole)
	role: AiMessageRole;

	@Field()
	content: string;

	@Field({nullable: true})
	thinking: string;

	@Field(() => [OrchardAiChatToolCall], {nullable: true})
	tool_calls: OrchardAiChatToolCall[];

	constructor(message: AiMessage) {
		this.role = message.role;
		this.content = message.content;
		this.thinking = message.thinking;
		this.tool_calls = message.tool_calls?.map((tool_call) => new OrchardAiChatToolCall(tool_call));
	}
}

@ObjectType()
export class OrchardAiChatUsage {
	@Field(() => Int, {nullable: true})
	prompt_tokens?: number;

	@Field(() => Int, {nullable: true})
	completion_tokens?: number;

	@Field({nullable: true})
	total_duration?: number;

	@Field({nullable: true})
	eval_duration?: number;

	constructor(usage: AiStreamUsage) {
		this.prompt_tokens = usage.prompt_tokens;
		this.completion_tokens = usage.completion_tokens;
		this.total_duration = usage.total_duration;
		this.eval_duration = usage.eval_duration;
	}
}

@ObjectType()
export class OrchardAiChatChunk {
	@Field()
	id: string;

	@Field()
	model: string;

	@Field(() => Int)
	created_at: number;

	@Field(() => OrchardAiChatMessage)
	message: OrchardAiChatMessage;

	@Field()
	done: boolean;

	@Field({nullable: true})
	done_reason: string;

	@Field(() => OrchardAiChatUsage, {nullable: true})
	usage?: OrchardAiChatUsage;

	constructor(chunk: AiStreamChunk, id: string) {
		this.id = id;
		this.model = chunk.model;
		this.created_at = Math.floor(new Date(chunk.created_at).getTime() / 1000);
		this.message = new OrchardAiChatMessage(chunk.message);
		this.done = chunk.done;
		this.done_reason = chunk.done_reason;
		this.usage = chunk.usage ? new OrchardAiChatUsage(chunk.usage) : undefined;
	}
}

@ObjectType()
export class OrchardAiChatStream {
	@Field()
	id: string;
}
