/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardAiChatMessage {
    @Field()
    role: string;

    @Field()
    content: string;
}

@ObjectType()
export class OrchardAiChatChunk {

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

    constructor(chunk_json: any) {
        this.model = chunk_json.model;
        this.created_at = Math.floor(new Date(chunk_json.created_at).getTime() / 1000);
        this.message = chunk_json.message;
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