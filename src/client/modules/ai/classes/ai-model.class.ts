/* Shared Dependencies */
import {OrchardAiModel, OrchardAiModelOllama, OrchardAiModelOpenRouter} from '@shared/generated.types';

export class AiModel implements OrchardAiModel {
	model: string;
	name: string;
	context_length: number;
	ollama?: OrchardAiModelOllama;
	openrouter?: OrchardAiModelOpenRouter;

	constructor(aiModel: OrchardAiModel) {
		this.model = aiModel.model;
		this.name = aiModel.name;
		this.context_length = aiModel.context_length;
		this.ollama = aiModel.ollama ?? undefined;
		this.openrouter = aiModel.openrouter ?? undefined;
	}
}
