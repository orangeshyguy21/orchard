import {OrchardAiAgent, OrchardAiAgentSystemMessage, OrchardAiAgentTool} from '@shared/generated.types';

export class AiAgentDefinition implements OrchardAiAgent {
	name: string;
	description: string;
	icon: string;
	section: string | null;
	system_message: OrchardAiAgentSystemMessage;
	tools: OrchardAiAgentTool[];

	constructor(oaa: OrchardAiAgent) {
		this.name = oaa.name;
		this.description = oaa.description;
		this.icon = oaa.icon;
		this.section = oaa.section ?? null;
		this.system_message = oaa.system_message;
		this.tools = oaa.tools;
	}
}
