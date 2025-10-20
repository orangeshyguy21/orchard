/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	username: string;

	@Column({unique: true, nullable: true})
	email: string;

	@Column({name: 'password_hash'})
	passwordHash: string;

	@Column({
		type: 'text',
		default: UserRole.USER,
	})
	role: UserRole;

	@Column({name: 'is_active', default: true})
	isActive: boolean;

	@CreateDateColumn({name: 'created_at'})
	createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt: Date;
}
