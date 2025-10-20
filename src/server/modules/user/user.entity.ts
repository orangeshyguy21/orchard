/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
/* Local Dependencies */
import {UserRole} from './user.enums';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	name: string;

	@Column()
	password_hash: string;

	@Column({
		type: 'text',
		default: UserRole.MEMBER,
	})
	role: UserRole;

	@Column({default: true})
	active: boolean;

	@CreateDateColumn()
	created_at: Date;
}
