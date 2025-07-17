/* Core Dependencies */
import {Field, Float, ObjectType} from '@nestjs/graphql';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Native Dependencies */
import {AiModel, AiModelDetails} from '@server/modules/ai/ai.types';

@ObjectType()
export class OrchardAiModelDetails {
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

	constructor(ai_model_details: AiModelDetails) {
		this.parent_model = ai_model_details.parent_model;
		this.format = ai_model_details.format;
		this.family = ai_model_details.family;
		this.families = ai_model_details.families;
		this.parameter_size = ai_model_details.parameter_size;
		this.quantization_level = ai_model_details.quantization_level;
	}
}

@ObjectType()
export class OrchardAiModel {
	@Field()
	name: string;

	@Field()
	model: string;

	@Field((type) => UnixTimestamp)
	modified_at: number;

	@Field(() => Float)
	size: number;

	@Field()
	digest: string;

	@Field(() => OrchardAiModelDetails)
	details: OrchardAiModelDetails;

	constructor(ai_model: AiModel) {
		this.name = ai_model.name;
		this.model = ai_model.model;
		this.modified_at = DateTime.fromISO(ai_model.modified_at).toUnixInteger();
		this.size = ai_model.size;
		this.digest = ai_model.digest;
		this.details = ai_model.details;
	}
}
