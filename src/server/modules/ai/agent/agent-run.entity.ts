/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
/* Local Dependencies */
import {AgentRunStatus} from './agent.enums';
import {Agent} from './agent.entity';

@Entity('agent_runs')
export class AgentRun {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Agent, (agent) => agent.runs, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'agent_id'})
	agent: Agent;

	@Column({type: 'text'})
	status: AgentRunStatus;

	@Column({type: 'text', nullable: true})
	schedule_trigger: string | null;

	@Column({type: 'integer'})
	started_at: number;

	@Column({type: 'integer', nullable: true})
	completed_at: number | null;

	@Column({type: 'text', nullable: true})
	result: string | null;

	@Column({type: 'text', nullable: true})
	error: string | null;

	@Column({type: 'integer', nullable: true})
	tokens_used: number | null;

	@Column({type: 'boolean', default: false})
	notified: boolean;
}
