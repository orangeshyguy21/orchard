/* Shared Dependencies */
import {AgentKey, OrchardAgentDefault} from '@shared/generated.types';

export class AiAgentDefault implements OrchardAgentDefault {
	agent_key: AgentKey;
	system_message: string;
	tools: string[];

	constructor(defaults: OrchardAgentDefault) {
		this.agent_key = defaults.agent_key;
		this.system_message = defaults.system_message;
		this.tools = defaults.tools;
	}
}
