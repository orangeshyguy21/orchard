/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository, MoreThan} from 'typeorm';
/* Application Dependencies */
import {UserRole} from '@server/modules/user/user.enums';
import {User} from '@server/modules/user/user.entity';
/* Local Dependencies */
import {Invite} from './invite.entity';

@Injectable()
export class InviteService {
	constructor(
		@InjectRepository(Invite)
		private inviteRepository: Repository<Invite>,
	) {}

	// /**
	//  * Get all invites
	//  * @returns {Promise<Invite[]>} The invites
	//  */
	// public async getInvites(): Promise<Invite[]> {
	// 	return this.inviteRepository.find();
	// }

	/**
	 * Get all active invites (unclaimed and not expired)
	 * @returns {Promise<Invite[]>} The active invites
	 */
	public async getInvites(): Promise<Invite[]> {
		return this.inviteRepository.find({
			where: [
				{
					used: false,
					expires_at: null, // never expires
				},
				{
					used: false,
					expires_at: MoreThan(new Date()), // expires in the future
				},
			],
			relations: ['created_by'], // include creator info for the API model
			order: {
				created_at: 'DESC',
			},
		});
	}

	/**
	 * Create a new invite
	 * @param {string} created_by_id - The ID of the user creating the invite
	 * @param {UserRole} role - The role to assign when invite is claimed
	 * @param {string | null} label - Optional label for the invite
	 * @param {Date | null} expires_at - Optional expiration date
	 * @returns {Promise<Invite>} The created invite
	 */
	public async createInvite(
		created_by_id: string,
		role: UserRole = UserRole.READER,
		label: string | null = null,
		expires_at: Date | null = null,
	): Promise<Invite> {
		const token = await this.generateUniqueToken();
		const invite = this.inviteRepository.create({
			token,
			label,
			role,
			created_by: {id: created_by_id} as User,
			expires_at,
			used: false,
			used_at: null,
			claimed_by: null,
		});
		return this.inviteRepository.save(invite);
	}

	/**
	 * Generate a unique cryptographically secure 12-character invite token
	 * @returns {Promise<string>} The unique token
	 */
	private async generateUniqueToken(): Promise<string> {
		const {randomBytes} = await import('crypto');
		const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
		let token: string;
		let exists: boolean;
		do {
			// Generate 12 random characters using cryptographically secure random bytes
			const random_bytes = randomBytes(12);
			token = Array.from(random_bytes)
				.map((byte) => CHARSET[byte % CHARSET.length])
				.join('');

			// Check if token already exists
			const existing_invite = await this.inviteRepository.findOne({
				where: {token},
			});
			exists = !!existing_invite;
		} while (exists);

		return token;
	}
}
