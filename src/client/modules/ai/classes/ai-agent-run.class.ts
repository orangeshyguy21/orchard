/* Shared Dependencies */
import {OrchardAgentRun, AgentRunStatus} from '@shared/generated.types';

export class AiAgentRun implements OrchardAgentRun {
	id: string;
	status: AgentRunStatus;
	started_at: number;
	completed_at: number | null;
	result: string | null;
	error: string | null;
	tokens_used: number | null;
	notified: boolean;

	constructor(run: OrchardAgentRun) {
		this.id = run.id;
		this.status = run.status;
		this.started_at = run.started_at;
		this.completed_at = run.completed_at ?? null;
		this.result = run.result ?? null;
		this.error = run.error ?? null;
		this.tokens_used = run.tokens_used ?? null;
		this.notified = run.notified;
	}
}
