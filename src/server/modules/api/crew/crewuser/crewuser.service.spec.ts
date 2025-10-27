/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {User} from '@server/modules/user/user.entity';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {CrewUserService} from './crewuser.service';
import {OrchardCrewUser} from './crewuser.model';
import {UserNameUpdateInput, UserPasswordUpdateInput} from './crewuser.input';

describe('CrewUserService', () => {
	let crew_user_service: CrewUserService;
	let error_service: jest.Mocked<ErrorService>;
	let user_service: jest.Mocked<UserService>;

	// helper method to create mock user
	const createMockUser = (overrides?: Partial<User>): User => {
		return {
			id: '1',
			name: 'TestUser',
			password_hash: 'hashed',
			role: UserRole.READER,
			active: true,
			created_at: new Date('2024-01-01'),
			updated_at: new Date('2024-01-02'),
			...overrides,
		} as User;
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CrewUserService,
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
				{
					provide: UserService,
					useValue: {
						getUserById: jest.fn(),
						updateUser: jest.fn(),
						validatePassword: jest.fn(),
					},
				},
			],
		}).compile();

		crew_user_service = module.get<CrewUserService>(CrewUserService);
		error_service = module.get(ErrorService);
		user_service = module.get(UserService);
	});

	it('should be defined', () => {
		expect(crew_user_service).toBeDefined();
	});

	describe('getUser', () => {
		it('returns OrchardCrewUser on success', async () => {
			const mock_user = createMockUser();
			user_service.getUserById.mockResolvedValue(mock_user);

			const result = await crew_user_service.getUser('TAG', '1');

			expect(result).toBeInstanceOf(OrchardCrewUser);
			expect(result.id).toBe('1');
			expect(result.name).toBe('TestUser');
			expect(result.role).toBe(UserRole.READER);
			expect(result.active).toBe(true);
			expect(user_service.getUserById).toHaveBeenCalledWith('1');
		});

		it('wraps errors via resolveError and throws OrchardApiError', async () => {
			user_service.getUserById.mockRejectedValue(new Error('Database error'));
			error_service.resolveError.mockReturnValue(OrchardErrorCode.UserError);

			await expect(crew_user_service.getUser('GET_USER_TAG', '1')).rejects.toBeInstanceOf(OrchardApiError);

			const calls = error_service.resolveError.mock.calls;
			const [, , tag_arg, code_arg] = calls[calls.length - 1];
			expect(tag_arg).toBe('GET_USER_TAG');
			expect(code_arg).toEqual({errord: OrchardErrorCode.UserError});
		});
	});

	describe('updateUserName', () => {
		it('returns OrchardCrewUser with updated name on success', async () => {
			const mock_user = createMockUser({name: 'NewName'});
			user_service.updateUser.mockResolvedValue(mock_user);

			const input: UserNameUpdateInput = {name: 'NewName'};
			const result = await crew_user_service.updateUserName('TAG', '1', input);

			expect(result).toBeInstanceOf(OrchardCrewUser);
			expect(result.name).toBe('NewName');
			expect(user_service.updateUser).toHaveBeenCalledWith('1', {name: 'NewName'});
		});

		it('wraps errors via resolveError and throws OrchardApiError', async () => {
			user_service.updateUser.mockRejectedValue(new Error('Update failed'));
			error_service.resolveError.mockReturnValue(OrchardErrorCode.UserError);

			const input: UserNameUpdateInput = {name: 'NewName'};
			await expect(crew_user_service.updateUserName('UPDATE_TAG', '1', input)).rejects.toBeInstanceOf(OrchardApiError);

			const calls = error_service.resolveError.mock.calls;
			const [, , tag_arg, code_arg] = calls[calls.length - 1];
			expect(tag_arg).toBe('UPDATE_TAG');
			expect(code_arg).toEqual({errord: OrchardErrorCode.UserError});
		});
	});

	describe('updateUserPassword', () => {
		it('returns OrchardCrewUser with updated password on success', async () => {
			const mock_user = createMockUser();
			const mock_updated_user = createMockUser({password_hash: 'new_hashed'});
			user_service.getUserById.mockResolvedValue(mock_user);
			user_service.validatePassword.mockResolvedValue(true);
			user_service.updateUser.mockResolvedValue(mock_updated_user);

			const input: UserPasswordUpdateInput = {password_old: 'old_pass', password_new: 'new_pass'};
			const result = await crew_user_service.updateUserPassword('TAG', '1', input);

			expect(result).toBeInstanceOf(OrchardCrewUser);
			expect(user_service.getUserById).toHaveBeenCalledWith('1');
			expect(user_service.validatePassword).toHaveBeenCalledWith(mock_user, 'old_pass');
			expect(user_service.updateUser).toHaveBeenCalledWith('1', {}, 'new_pass');
		});

		it('throws OrchardApiError when user not found', async () => {
			user_service.getUserById.mockResolvedValue(null);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.UserError);

			const input: UserPasswordUpdateInput = {password_old: 'old_pass', password_new: 'new_pass'};
			await expect(crew_user_service.updateUserPassword('TAG', '1', input)).rejects.toBeInstanceOf(OrchardApiError);
		});

		it('throws OrchardApiError when old password is invalid', async () => {
			const mock_user = createMockUser();
			user_service.getUserById.mockResolvedValue(mock_user);
			user_service.validatePassword.mockResolvedValue(false);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InvalidPasswordError);

			const input: UserPasswordUpdateInput = {password_old: 'wrong_pass', password_new: 'new_pass'};
			await expect(crew_user_service.updateUserPassword('TAG', '1', input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(user_service.validatePassword).toHaveBeenCalledWith(mock_user, 'wrong_pass');
		});

		it('wraps errors via resolveError with correct tag', async () => {
			const mock_user = createMockUser();
			user_service.getUserById.mockResolvedValue(mock_user);
			user_service.validatePassword.mockResolvedValue(true);
			user_service.updateUser.mockRejectedValue(new Error('Update failed'));
			error_service.resolveError.mockReturnValue(OrchardErrorCode.UserError);

			const input: UserPasswordUpdateInput = {password_old: 'old_pass', password_new: 'new_pass'};
			await expect(crew_user_service.updateUserPassword('PWD_UPDATE_TAG', '1', input)).rejects.toBeInstanceOf(OrchardApiError);

			const calls = error_service.resolveError.mock.calls;
			const [, , tag_arg, code_arg] = calls[calls.length - 1];
			expect(tag_arg).toBe('PWD_UPDATE_TAG');
			expect(code_arg).toEqual({errord: OrchardErrorCode.UserError});
		});
	});
});
