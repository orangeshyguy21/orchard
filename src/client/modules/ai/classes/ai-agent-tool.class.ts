/* Shared Dependencies */
import {OrchardAgentTool} from '@shared/generated.types';

export class AiAgentTool implements OrchardAgentTool {
	name: string;
	description: string;
	category: string;
	throttle_max_calls: number;
	throttle_window_seconds: number;

	constructor(tool: OrchardAgentTool) {
		this.name = tool.name;
		this.description = tool.description;
		this.category = tool.category;
		this.throttle_max_calls = tool.throttle_max_calls;
		this.throttle_window_seconds = tool.throttle_window_seconds;
	}
}
