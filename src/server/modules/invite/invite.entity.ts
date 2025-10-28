/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, OneToOne, JoinColumn} from 'typeorm';
/* Application Dependencies */
import {UserRole} from '@server/modules/user/user.enums';
import {User} from '@server/modules/user/user.entity';

@Entity('invites')
@Index(['used', 'expires_at'])
export class Invite {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true, length: 12})
	token: string; // unique 8-char invite code

	@Column({type: 'text', nullable: true, length: 100})
	label: string | null; // suggested label at time of invite creation

	@Column({type: 'text', default: UserRole.READER})
	role: UserRole; // role to assign when claimed

	@ManyToOne(() => User, {onDelete: 'RESTRICT'})
	@JoinColumn({name: 'created_by_id'})
	created_by: User; // admin who created the invite

	@OneToOne(() => User, {nullable: true, onDelete: 'SET NULL'})
	@JoinColumn({name: 'claimed_by_id'})
	claimed_by: User | null; // user who claimed the invite

	@Column({default: false})
	used: boolean; // whether the invite has been claimed

	@Column({nullable: true})
	used_at: number | null; // when the invite was claimed

	@Column({nullable: true})
	expires_at: number | null; // optional expiration date

	@Column({type: 'integer'})
	created_at: number;
}
