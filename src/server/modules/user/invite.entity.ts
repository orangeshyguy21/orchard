/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn} from 'typeorm';
/* Local Dependencies */
import {User} from './user.entity';
import {UserRole} from './user.enums';

@Entity('invites')
export class Invite {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true, length: 8})
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
	used_at: Date | null; // when the invite was claimed

	@Column({nullable: true})
	expires_at: Date | null; // optional expiration date

	@CreateDateColumn()
	created_at: Date;
}
