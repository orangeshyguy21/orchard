/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
/* Local Dependencies */
import {AgentKey} from './agent.enums';
import {AgentRun} from './agent-run.entity';

@Entity('agents')
export class Agent {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({type: 'text', nullable: true, unique: true})
	agent_key: AgentKey | null;

	@Column({type: 'text'})
	name: string;

	@Column({type: 'text'})
	description: string;

	@Column({default: false})
	active: boolean;

	@Column({type: 'text', nullable: true})
	model: string | null;

	@Column({type: 'text'})
	system_message: string;

	@Column({type: 'text', default: '[]'})
	tools: string;

	@Column({type: 'text', default: '[]'})
	schedules: string;

	@Column({type: 'integer', nullable: true})
	last_run_at: number | null;

	@Column({type: 'text', nullable: true})
	last_run_status: string | null;

	@Column({type: 'integer'})
	created_at: number;

	@Column({type: 'integer'})
	updated_at: number;

	@OneToMany(() => AgentRun, (run) => run.agent, {cascade: true})
	runs: AgentRun[];
}
