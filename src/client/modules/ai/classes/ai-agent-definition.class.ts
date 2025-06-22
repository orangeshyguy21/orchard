import { OrchardAiAgent, OrchardAiAgentSystemMessage, OrchardAiAgentTool } from "@shared/generated.types";

export class AiAgentDefinition implements OrchardAiAgent {

	name: string;
	description: string;
	system_message: OrchardAiAgentSystemMessage;
	tools: OrchardAiAgentTool[];

	constructor(oaa: OrchardAiAgent) {
		this.name = oaa.name;
		this.description = oaa.description;
		this.system_message = oaa.system_message;
		this.tools = oaa.tools;
	}
}