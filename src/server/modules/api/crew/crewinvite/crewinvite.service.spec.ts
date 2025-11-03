/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {InviteService} from '@server/modules/invite/invite.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {UserRole} from '@server/modules/user/user.enums';
import {User} from '@server/modules/user/user.entity';
import {Invite} from '@server/modules/invite/invite.entity';
/* Local Dependencies */
import {CrewInviteService} from './crewinvite.service';
import {OrchardCrewInvite} from './crewinvite.model';
import {InviteCreateInput, InviteUpdateInput} from './crewinvite.input';

describe('CrewInviteService', () => {
	let crew_invite_service: CrewInviteService;
	let invite_service: jest.Mocked<InviteService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CrewInviteService,
				{
					provide: InviteService,
					useValue: {
						getInvites: jest.fn(),
						createInvite: jest.fn(),
						updateInvite: jest.fn(),
						deleteInvite: jest.fn(),
					},
				},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		crew_invite_service = module.get<CrewInviteService>(CrewInviteService);
		invite_service = module.get(InviteService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(crew_invite_service).toBeDefined();
	});

	describe('getInvites', () => {
		it('returns array of OrchardCrewInvite models', async () => {
			const mock_invites = [
				{
					id: '1',
					token: 'ABC123DEF456',
					label: 'Test Invite',
					role: UserRole.READER,
					created_by: {id: 'user1'} as User,
					claimed_by: null,
					used_at: null,
					expires_at: null,
					created_at: Math.floor(DateTime.now().toSeconds()),
				} as Invite,
				{
					id: '2',
					token: 'GHI789JKL012',
					label: 'Manager Invite',
					role: UserRole.MANAGER,
					created_by: {id: 'user1'} as User,
					claimed_by: null,
					used_at: null,
					expires_at: Math.floor(DateTime.now().plus({days: 7}).toSeconds()),
					created_at: Math.floor(DateTime.now().toSeconds()),
				} as Invite,
			];

			invite_service.getInvites.mockResolvedValue(mock_invites);

			const result = await crew_invite_service.getInvites('TEST_TAG');

			expect(result).toHaveLength(2);
			expect(result[0]).toBeInstanceOf(OrchardCrewInvite);
			expect(result[0].id).toBe('1');
			expect(result[0].token).toBe('ABC123DEF456');
			expect(result[0].created_by_id).toBe('user1');
			expect(result[1]).toBeInstanceOf(OrchardCrewInvite);
			expect(result[1].id).toBe('2');
			expect(invite_service.getInvites).toHaveBeenCalled();
		});

		it('returns empty array when no invites', async () => {
			invite_service.getInvites.mockResolvedValue([]);

			const result = await crew_invite_service.getInvites('TEST_TAG');

			expect(result).toHaveLength(0);
		});

		it('throws OrchardApiError when service fails', async () => {
			const error = new Error('Database error');
			invite_service.getInvites.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InviteError);

			await expect(crew_invite_service.getInvites('ERROR_TAG')).rejects.toBeInstanceOf(OrchardApiError);

			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.InviteError,
			});
		});
	});

	describe('createInvite', () => {
		it('creates invite and returns OrchardCrewInvite model', async () => {
			const create_input: InviteCreateInput = {
				label: 'New Invite',
				role: UserRole.READER,
				expires_at: Math.floor(DateTime.now().plus({days: 30}).toSeconds()),
			};

			const mock_created_invite = {
				id: '123',
				token: 'NEW123TOKEN4',
				label: 'New Invite',
				role: UserRole.READER,
				created_by: {id: 'admin1'} as User,
				claimed_by: null,
				used_at: null,
				expires_at: create_input.expires_at,
				created_at: Math.floor(DateTime.now().toSeconds()),
			} as Invite;

			invite_service.createInvite.mockResolvedValue(mock_created_invite);

			const result = await crew_invite_service.createInvite('CREATE_TAG', 'admin1', create_input);

			expect(result).toBeInstanceOf(OrchardCrewInvite);
			expect(result.id).toBe('123');
			expect(result.token).toBe('NEW123TOKEN4');
			expect(result.label).toBe('New Invite');
			expect(result.role).toBe(UserRole.READER);
			expect(result.created_by_id).toBe('admin1');
			expect(invite_service.createInvite).toHaveBeenCalledWith('admin1', UserRole.READER, 'New Invite', create_input.expires_at);
		});

		it('creates invite with minimal input', async () => {
			const create_input: InviteCreateInput = {
				role: UserRole.MANAGER,
			};

			const mock_created_invite = {
				id: '456',
				token: 'MIN123TOKEN4',
				label: null,
				role: UserRole.MANAGER,
				created_by: {id: 'admin2'} as User,
				claimed_by: null,
				used_at: null,
				expires_at: null,
				created_at: Math.floor(DateTime.now().toSeconds()),
			} as Invite;

			invite_service.createInvite.mockResolvedValue(mock_created_invite);

			const result = await crew_invite_service.createInvite('CREATE_TAG', 'admin2', create_input);

			expect(result).toBeInstanceOf(OrchardCrewInvite);
			expect(result.label).toBeNull();
			expect(result.expires_at).toBeNull();
			expect(invite_service.createInvite).toHaveBeenCalledWith('admin2', UserRole.MANAGER, undefined, undefined);
		});

		it('throws OrchardApiError when creation fails', async () => {
			const create_input: InviteCreateInput = {
				role: UserRole.READER,
			};

			const error = new Error('Creation failed');
			invite_service.createInvite.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InviteError);

			await expect(crew_invite_service.createInvite('ERROR_TAG', 'admin1', create_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.InviteError,
			});
		});
	});

	describe('updateInvite', () => {
		it('updates invite and returns OrchardCrewInvite model', async () => {
			const update_input: InviteUpdateInput = {
				id: '789',
				label: 'Updated Label',
				role: UserRole.MANAGER,
				expires_at: Math.floor(DateTime.now().plus({days: 14}).toSeconds()),
			};

			const mock_updated_invite = {
				id: '789',
				token: 'UPD123TOKEN4',
				label: 'Updated Label',
				role: UserRole.MANAGER,
				created_by: {id: 'admin1'} as User,
				claimed_by: null,
				used_at: null,
				expires_at: update_input.expires_at,
				created_at: Math.floor(DateTime.now().minus({days: 1}).toSeconds()),
			} as Invite;

			invite_service.updateInvite.mockResolvedValue(mock_updated_invite);

			const result = await crew_invite_service.updateInvite('UPDATE_TAG', update_input);

			expect(result).toBeInstanceOf(OrchardCrewInvite);
			expect(result.id).toBe('789');
			expect(result.label).toBe('Updated Label');
			expect(result.role).toBe(UserRole.MANAGER);
			expect(invite_service.updateInvite).toHaveBeenCalledWith('789', update_input);
		});

		it('updates invite with partial fields', async () => {
			const update_input: InviteUpdateInput = {
				id: '999',
				label: 'Only Label Changed',
				role: UserRole.READER,
			};

			const mock_updated_invite = {
				id: '999',
				token: 'PARTIAL12TOK',
				label: 'Only Label Changed',
				role: UserRole.READER,
				created_by: {id: 'admin1'} as User,
				claimed_by: null,
				used_at: null,
				expires_at: null,
				created_at: Math.floor(DateTime.now().minus({days: 2}).toSeconds()),
			} as Invite;

			invite_service.updateInvite.mockResolvedValue(mock_updated_invite);

			const result = await crew_invite_service.updateInvite('UPDATE_TAG', update_input);

			expect(result).toBeInstanceOf(OrchardCrewInvite);
			expect(result.label).toBe('Only Label Changed');
			expect(invite_service.updateInvite).toHaveBeenCalledWith('999', update_input);
		});

		it('throws OrchardApiError when update fails', async () => {
			const update_input: InviteUpdateInput = {
				id: 'invalid',
				role: UserRole.READER,
			};

			const error = new Error('Update failed');
			invite_service.updateInvite.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InviteError);

			await expect(crew_invite_service.updateInvite('ERROR_TAG', update_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.InviteError,
			});
		});
	});

	describe('deleteInvite', () => {
		it('deletes invite successfully', async () => {
			invite_service.deleteInvite.mockResolvedValue(undefined);

			await crew_invite_service.deleteInvite('DELETE_TAG', '123');

			expect(invite_service.deleteInvite).toHaveBeenCalledWith('123');
		});

		it('throws OrchardApiError when deletion fails', async () => {
			const error = new Error('Deletion failed');
			invite_service.deleteInvite.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InviteError);

			await expect(crew_invite_service.deleteInvite('ERROR_TAG', 'invalid')).rejects.toBeInstanceOf(OrchardApiError);

			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.InviteError,
			});
		});
	});
});
