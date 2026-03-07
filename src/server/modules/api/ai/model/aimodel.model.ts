/* Core Dependencies */
import {Field, Float, Int, ObjectType} from '@nestjs/graphql';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {AiModel, AiModelOllama, AiModelOpenRouter} from '@server/modules/ai/ai.types';

@ObjectType()
export class OrchardAiModelOllama {
	@Field(() => UnixTimestamp)
	modified_at: number;

	@Field(() => Float)
	size: number;

	@Field()
	digest: string;

	@Field()
	parent_model: string;

	@Field()
	format: string;

	@Field()
	family: string;

	@Field(() => [String])
	families: string[];

	@Field()
	parameter_size: string;

	@Field()
	quantization_level: string;

	constructor(details: AiModelOllama) {
		this.modified_at = DateTime.fromISO(details.modified_at).toUnixInteger();
		this.size = details.size;
		this.digest = details.digest;
		this.parent_model = details.parent_model;
		this.format = details.format;
		this.family = details.family;
		this.families = details.families;
		this.parameter_size = details.parameter_size;
		this.quantization_level = details.quantization_level;
	}
}

@ObjectType()
export class OrchardAiModelOpenRouter {
	@Field()
	pricing_prompt: string;

	@Field()
	pricing_completion: string;

	@Field()
	modality: string;

	@Field()
	tokenizer: string;

	@Field(() => Int)
	max_completion_tokens: number;

	@Field()
	family: string;

	constructor(details: AiModelOpenRouter) {
		this.pricing_prompt = details.pricing_prompt;
		this.pricing_completion = details.pricing_completion;
		this.modality = details.modality;
		this.tokenizer = details.tokenizer;
		this.max_completion_tokens = details.max_completion_tokens;
		this.family = details.family;
	}
}

@ObjectType()
export class OrchardAiModel {
	@Field()
	model: string;

	@Field()
	name: string;

	@Field(() => Int)
	context_length: number;

	@Field(() => OrchardAiModelOllama, {nullable: true})
	ollama?: OrchardAiModelOllama;

	@Field(() => OrchardAiModelOpenRouter, {nullable: true})
	openrouter?: OrchardAiModelOpenRouter;

	constructor(ai_model: AiModel) {
		this.model = ai_model.model;
		this.name = ai_model.name;
		this.context_length = ai_model.context_length;
		this.ollama = ai_model.ollama ? new OrchardAiModelOllama(ai_model.ollama) : undefined;
		this.openrouter = ai_model.openrouter ? new OrchardAiModelOpenRouter(ai_model.openrouter) : undefined;
	}
}
