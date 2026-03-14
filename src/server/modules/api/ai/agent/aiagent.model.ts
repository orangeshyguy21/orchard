/* Core Dependencies */
import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {safeParse} from '@server/utils/safe-parse';
/* Native Dependencies */
import {AgentKey, AgentRunStatus} from '@server/modules/ai/agent/agent.enums';
import {Agent} from '@server/modules/ai/agent/agent.entity';
import {AgentRun} from '@server/modules/ai/agent/agent-run.entity';

@ObjectType({description: 'AI agent configuration'})
export class OrchardAgent {
	@Field(() => ID, {description: 'Unique agent identifier'})
	id: string;

	@Field(() => AgentKey, {nullable: true, description: 'Predefined agent key'})
	agent_key: AgentKey | null;

	@Field({description: 'Agent name'})
	name: string;

	@Field({description: 'Agent description'})
	description: string;

	@Field({description: 'Whether the agent is active'})
	active: boolean;

	@Field({nullable: true, description: 'LLM model identifier'})
	model: string | null;

	@Field({description: 'System message used to instruct the agent'})
	system_message: string;

	@Field(() => [String], {description: 'List of tool identifiers available to the agent'})
	tools: string[];

	@Field(() => [String], {description: 'Cron schedules for automatic execution'})
	schedules: string[];

	@Field(() => UnixTimestamp, {nullable: true, description: 'Timestamp of the last execution'})
	last_run_at: number | null;

	@Field(() => AgentRunStatus, {nullable: true, description: 'Status of the last execution'})
	last_run_status: AgentRunStatus | null;

	@Field(() => UnixTimestamp, {description: 'Timestamp when the agent was created'})
	created_at: number;

	@Field(() => UnixTimestamp, {description: 'Timestamp when the agent was last updated'})
	updated_at: number;

	constructor(agent: Agent) {
		this.id = agent.id;
		this.agent_key = agent.agent_key;
		this.name = agent.name;
		this.description = agent.description;
		this.active = agent.active;
		this.model = agent.model;
		this.system_message = agent.system_message;
		this.tools = safeParse(agent.tools, [], `agent.tools[${agent.id}]`);
		this.schedules = safeParse(agent.schedules, [], `agent.schedules[${agent.id}]`);
		this.last_run_at = agent.last_run_at;
		this.last_run_status = agent.last_run_status as AgentRunStatus | null;
		this.created_at = agent.created_at;
		this.updated_at = agent.updated_at;
	}
}

@ObjectType({description: 'AI agent execution run'})
export class OrchardAgentRun {
	@Field(() => ID, {description: 'Unique run identifier'})
	id: string;

	@Field(() => AgentRunStatus, {description: 'Current status of the run'})
	status: AgentRunStatus;

	@Field({nullable: true, description: 'Cron schedule that triggered the run'})
	schedule_trigger: string | null;

	@Field(() => UnixTimestamp, {description: 'Timestamp when the run started'})
	started_at: number;

	@Field(() => UnixTimestamp, {nullable: true, description: 'Timestamp when the run completed'})
	completed_at: number | null;

	@Field({nullable: true, description: 'Result output of the run'})
	result: string | null;

	@Field({nullable: true, description: 'Error message if the run failed'})
	error: string | null;

	@Field(() => Int, {nullable: true, description: 'Number of tokens consumed during the run'})
	tokens_used: number | null;

	@Field({description: 'Whether the user has been notified of the run result'})
	notified: boolean;

	constructor(run: AgentRun) {
		this.id = run.id;
		this.status = run.status as AgentRunStatus;
		this.schedule_trigger = run.schedule_trigger;
		this.started_at = run.started_at;
		this.completed_at = run.completed_at;
		this.result = run.result;
		this.error = run.error;
		this.tokens_used = run.tokens_used;
		this.notified = run.notified;
	}
}
