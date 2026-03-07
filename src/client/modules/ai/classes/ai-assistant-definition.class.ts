import {OrchardAiAssistant, OrchardAiAssistantSystemMessage, OrchardAiAssistantTool} from '@shared/generated.types';

export class AiAssistantDefinition implements OrchardAiAssistant {
	name: string;
	description: string;
	icon: string;
	section: string | null;
	system_message: OrchardAiAssistantSystemMessage;
	tools: OrchardAiAssistantTool[];

	constructor(oaa: OrchardAiAssistant) {
		this.name = oaa.name;
		this.description = oaa.description;
		this.icon = oaa.icon;
		this.section = oaa.section ?? null;
		this.system_message = oaa.system_message;
		this.tools = oaa.tools;
	}
}
