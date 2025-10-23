/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
/* Local Dependencies */
import {UserRole} from './user.enums';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true, length: 50})
	name: string;

	@Column({length: 60})
	password_hash: string;

	@Column({
		type: 'text',
		default: UserRole.READER,
	})
	role: UserRole;

	@Column({default: true})
	active: boolean;

	@Column({type: 'text', nullable: true, length: 100})
	label: string | null;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
