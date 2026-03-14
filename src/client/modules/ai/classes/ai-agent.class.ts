/* Shared Dependencies */
import {OrchardAgent, AgentKey, AgentRunStatus} from '@shared/generated.types';

export class AiAgent implements OrchardAgent {
	id: string;
	agent_key: AgentKey | null;
	name: string;
	description: string | null;
	active: boolean;
	system_message: string | null;
	tools: string[];
	schedules: string[];
	last_run_at: number | null;
	last_run_status: AgentRunStatus | null;
	created_at: number;
	updated_at: number;

	constructor(agent: OrchardAgent) {
		this.id = agent.id;
		this.agent_key = agent.agent_key ?? null;
		this.name = agent.name;
		this.description = agent.description ?? null;
		this.active = agent.active;
		this.system_message = agent.system_message ?? null;
		this.tools = agent.tools ?? [];
		this.schedules = agent.schedules;
		this.last_run_at = agent.last_run_at ?? null;
		this.last_run_status = agent.last_run_status ?? null;
		this.created_at = agent.created_at;
		this.updated_at = agent.updated_at;
	}
}
