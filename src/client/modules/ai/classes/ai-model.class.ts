import { OrchardAiModel, OrchardAiModelDetails } from "@shared/generated.types";

export class AiModel implements OrchardAiModel {

	model: string;
	modified_at: string;
	name: string;
	size: number;
	digest: string;
	details: OrchardAiModelDetails;

	constructor(aiModel: OrchardAiModel) {
		this.model = aiModel.model;
		this.modified_at = aiModel.modified_at;
		this.name = aiModel.name;
		this.size = aiModel.size;
		this.digest = aiModel.digest;
		this.details = aiModel.details;
	}
}