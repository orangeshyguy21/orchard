/* Core Dependencies */
import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
/* Native Dependencies */
import {AgentKey, AgentRunStatus} from '@server/modules/ai/agent/agent.enums';
import {Agent} from '@server/modules/ai/agent/agent.entity';
import {AgentRun} from '@server/modules/ai/agent/agent-run.entity';

@ObjectType()
export class OrchardAgent {
	@Field(() => ID)
	id: string;

	@Field(() => AgentKey, {nullable: true})
	agent_key: AgentKey | null;

	@Field()
	name: string;

	@Field({nullable: true})
	description: string | null;

	@Field()
	active: boolean;

	@Field({nullable: true})
	system_message: string | null;

	@Field(() => [String], {nullable: true})
	tools: string[] | null;

	@Field(() => [String])
	schedules: string[];

	@Field(() => UnixTimestamp, {nullable: true})
	last_run_at: number | null;

	@Field(() => AgentRunStatus, {nullable: true})
	last_run_status: AgentRunStatus | null;

	@Field(() => UnixTimestamp)
	created_at: number;

	@Field(() => UnixTimestamp)
	updated_at: number;

	constructor(agent: Agent) {
		this.id = agent.id;
		this.agent_key = agent.agent_key;
		this.name = agent.name;
		this.description = agent.description;
		this.active = agent.active;
		this.system_message = agent.system_message;
		this.tools = JSON.parse(agent.tools);
		this.schedules = JSON.parse(agent.schedules);
		this.last_run_at = agent.last_run_at;
		this.last_run_status = agent.last_run_status as AgentRunStatus | null;
		this.created_at = agent.created_at;
		this.updated_at = agent.updated_at;
	}
}

@ObjectType()
export class OrchardAgentRun {
	@Field(() => ID)
	id: string;

	@Field(() => AgentRunStatus)
	status: AgentRunStatus;

	@Field({nullable: true})
	schedule_trigger: string | null;

	@Field(() => UnixTimestamp)
	started_at: number;

	@Field(() => UnixTimestamp, {nullable: true})
	completed_at: number | null;

	@Field({nullable: true})
	result: string | null;

	@Field({nullable: true})
	error: string | null;

	@Field(() => Int, {nullable: true})
	tokens_used: number | null;

	constructor(run: AgentRun) {
		this.id = run.id;
		this.status = run.status as AgentRunStatus;
		this.schedule_trigger = run.schedule_trigger;
		this.started_at = run.started_at;
		this.completed_at = run.completed_at;
		this.result = run.result;
		this.error = run.error;
		this.tokens_used = run.tokens_used;
	}
}
