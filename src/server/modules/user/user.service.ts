/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
/* Local Dependencies */
import {User} from './user.entity';
import {UserRole} from './user.enums';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	/**
	 * Get a user by name (enforced uniqueness)
	 * @param {string} name - The name of the user
	 * @returns {Promise<User>} The user
	 */
	public async getUserByName(name: string): Promise<User | null> {
		return this.userRepository.findOne({where: {name}});
	}

	/**
	 * Get a user by id
	 * @param {string} id - The id of the user
	 * @returns {Promise<User>} The user
	 */
	public async getUserById(id: string): Promise<User | null> {
		return this.userRepository.findOne({where: {id}});
	}

	/**
	 * Validate a password
	 * @param {User} user - The user
	 * @param {string} password - The password
	 * @returns {Promise<boolean>} Whether the password is valid
	 */
	public async validatePassword(user: User, password: string): Promise<boolean> {
		return bcrypt.compare(password, user.password_hash);
	}

	/**
	 * Create a user
	 * @param {string} name - The name of the user
	 * @param {string} password - The password of the user
	 * @returns {Promise<User>} The created user
	 */
	public async createUser(name: string, password: string): Promise<User> {
		const password_hash = await bcrypt.hash(password, 10);
		const user_count = await this.userRepository.count();
		const role = user_count === 0 ? UserRole.ADMIN : UserRole.MEMBER;
		const user = this.userRepository.create({
			name,
			password_hash,
			role,
		});
		return this.userRepository.save(user);
	}

	/**
	 * Check if the first user is the admin
	 * @returns {Promise<boolean>} Whether the first user is the admin
	 */
	public async getUserCount(): Promise<number> {
		return await this.userRepository.count();
	}
}
