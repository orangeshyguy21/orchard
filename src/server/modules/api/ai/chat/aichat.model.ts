/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { AiToolCall, AiMessage } from '@server/modules/ai/ai.types';
import { AiMessageRole, AiFunctionName } from '@server/modules/ai/ai.enums';

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

    constructor(tool_call: any) {
        this.function = new OrchardAiChatFunction(tool_call.function);
    }
}

@ObjectType()
export class OrchardAiChatMessage {
    @Field(() => AiMessageRole)
    role: AiMessageRole;

    @Field()
    content: string;

    @Field(() => [OrchardAiChatToolCall], { nullable: true })
    tool_calls: OrchardAiChatToolCall[];

    constructor(message: AiMessage) {
        this.role = message.role;
        this.content = message.content;
        this.tool_calls = message.tool_calls?.map((tool_call: any) => new OrchardAiChatToolCall(tool_call));
    }
}

@ObjectType()
export class OrchardAiChatChunk {

    @Field()
    id: string;

    @Field()
    model: string;

    @Field(type => Int)
    created_at: number;

    @Field(() => OrchardAiChatMessage)
    message: OrchardAiChatMessage;

    @Field()
    done: boolean;

    @Field({ nullable: true })
    done_reason: string;

    @Field({ nullable: true })
    total_duration: number;

    @Field({ nullable: true })
    load_duration: number;

    @Field({ nullable: true })
    prompt_eval_count: number;

    @Field({ nullable: true })
    prompt_eval_duration: number;

    @Field({ nullable: true })
    eval_count: number;

    @Field({ nullable: true })
    eval_duration: number;

    constructor(chunk_json: any, id: string) {
        this.id = id;
        this.model = chunk_json.model;
        this.created_at = Math.floor(new Date(chunk_json.created_at).getTime() / 1000);
        this.message = new OrchardAiChatMessage(chunk_json.message);
        this.done = chunk_json.done;
        this.done_reason = chunk_json.done_reason;
        this.total_duration = chunk_json.total_duration;
        this.load_duration = chunk_json.load_duration;
        this.prompt_eval_count = chunk_json.prompt_eval_count;
        this.prompt_eval_duration = chunk_json.prompt_eval_duration;
        this.eval_count = chunk_json.eval_count;
        this.eval_duration = chunk_json.eval_duration;
    }
}   

@ObjectType()
export class OrchardAiChatStream {
    @Field()
    id: string;
}