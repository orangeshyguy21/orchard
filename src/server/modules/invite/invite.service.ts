/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository, MoreThan} from 'typeorm';
import {DateTime} from 'luxon';
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

	/**
	 * Get all active invites (unclaimed and not expired)
	 * @returns {Promise<Invite[]>} The active invites
	 */
	public async getInvites(): Promise<Invite[]> {
		const now = Math.floor(DateTime.now().toSeconds());
		return this.inviteRepository.find({
			where: [
				{
					used_at: null,
					expires_at: null, // never expires
				},
				{
					used_at: null,
					expires_at: MoreThan(now), // expires in the future
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
		expires_at: number | null = null,
	): Promise<Invite> {
		const token = await this.generateUniqueToken();
		const created_at = Math.floor(DateTime.now().toSeconds());
		const invite = this.inviteRepository.create({
			token,
			label,
			role,
			created_by: {id: created_by_id} as User,
			expires_at,
			used_at: null,
			claimed_by: null,
			created_at,
		});
		return this.inviteRepository.save(invite);
	}

	/**
	 * Update an existing invite (can only update unclaimed invites)
	 * @param {string} invite_id - The ID of the invite to update
	 * @param {Partial<{label: string | null, role: UserRole, expires_at: number | null}>} updates - Fields to update
	 * @returns {Promise<Invite>} The updated invite
	 * @throws {Error} If invite not found or already claimed
	 */
	public async updateInvite(
		invite_id: string,
		updates: Partial<{
			label: string | null;
			role: UserRole;
			expires_at: number | null;
		}>,
	): Promise<Invite> {
		const invite = await this.inviteRepository.findOne({
			where: {id: invite_id},
			relations: ['created_by'],
		});
		if (!invite) throw new Error('Invite not found');
		if (invite.used_at !== null) throw new Error('Cannot update an invite that has already been claimed');
		if (updates.label !== undefined) invite.label = updates.label;
		if (updates.role !== undefined) invite.role = updates.role;
		if (updates.expires_at !== undefined) invite.expires_at = updates.expires_at;
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
