/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
/* Application Dependencies */
import {Agent} from '@server/modules/ai/agent/agent.entity';
/* Local Dependencies */
import {ConversationStatus} from './conversation.enums';

@Entity('conversations')
export class Conversation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Agent, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'source_agent_id'})
	source_agent: Agent;

	@Column({type: 'text'})
	user_id: string;

	@Column({type: 'text'})
	chat_id: string;

	@Column({type: 'text', default: ConversationStatus.ACTIVE})
	status: ConversationStatus;

	@Column({type: 'text', default: '[]'})
	messages: string;

	@Column({type: 'integer', default: 0})
	tokens_used: number;

	@Column({type: 'integer'})
	created_at: number;

	@Column({type: 'integer'})
	last_activity_at: number;
}
