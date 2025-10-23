/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {AuthInitializationService} from './initialization.service';
import {OrchardAuthentication} from '../authentication/authentication.model';
import {OrchardInitialization} from './initialization.model';
import {InitializationInput} from './initialization.input';

describe('AtuhInitializationService', () => {
	let initialization_service: AuthInitializationService;
	let auth_service: jest.Mocked<AuthService>;
	let error_service: jest.Mocked<ErrorService>;
	let user_service: jest.Mocked<UserService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthInitializationService,
				{
					provide: AuthService,
					useValue: {
						validateSetupKey: jest.fn(),
						getToken: jest.fn(),
						getInitialization: jest.fn(),
					},
				},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
				{
					provide: UserService,
					useValue: {
						getUserByName: jest.fn(),
						createUser: jest.fn(),
					},
				},
			],
		}).compile();

		initialization_service = module.get<AuthInitializationService>(AuthInitializationService);
		auth_service = module.get(AuthService);
		error_service = module.get(ErrorService);
		user_service = module.get(UserService);
	});

	it('should be defined', () => {
		expect(initialization_service).toBeDefined();
	});

	describe('initialize', () => {
		const mock_input: InitializationInput = {
			key: 'setup-key',
			name: 'testuser',
			password: 'testpass',
		};

		it('returns OrchardAuthentication on successful initialization', async () => {
			auth_service.validateSetupKey.mockResolvedValue(true);
			user_service.getUserByName.mockResolvedValue(null);
			user_service.createUser.mockResolvedValue({id: 'user-id', name: 'testuser'} as any);
			auth_service.getToken.mockResolvedValue({access_token: 'a', refresh_token: 'r'} as any);

			const result = await initialization_service.initialize('TAG', mock_input);

			expect(result).toBeInstanceOf(OrchardAuthentication);
			expect(auth_service.validateSetupKey).toHaveBeenCalledWith(mock_input.key);
			expect(user_service.getUserByName).toHaveBeenCalledWith(mock_input.name);
			expect(user_service.createUser).toHaveBeenCalledWith(mock_input.name, mock_input.password, UserRole.ADMIN);
			expect(auth_service.getToken).toHaveBeenCalledWith('user-id', mock_input.password);
		});

		it('throws OrchardApiError when setup key is invalid', async () => {
			auth_service.validateSetupKey.mockResolvedValue(false);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InitializationKeyError);

			await expect(initialization_service.initialize('TAG', mock_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(auth_service.validateSetupKey).toHaveBeenCalledWith(mock_input.key);
			expect(user_service.getUserByName).not.toHaveBeenCalled();
		});

		it('throws OrchardApiError when username already exists', async () => {
			auth_service.validateSetupKey.mockResolvedValue(true);
			user_service.getUserByName.mockResolvedValue({id: 'existing-user', name: 'testuser'} as any);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.UniqueUsernameError);

			await expect(initialization_service.initialize('TAG', mock_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(user_service.getUserByName).toHaveBeenCalledWith(mock_input.name);
			expect(user_service.createUser).not.toHaveBeenCalled();
		});

		it('throws OrchardApiError when token generation fails', async () => {
			auth_service.validateSetupKey.mockResolvedValue(true);
			user_service.getUserByName.mockResolvedValue(null);
			user_service.createUser.mockResolvedValue({id: 'user-id', name: 'testuser'} as any);
			auth_service.getToken.mockResolvedValue(null);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.AuthenticationError);

			await expect(initialization_service.initialize('TAG', mock_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(auth_service.getToken).toHaveBeenCalledWith('user-id', mock_input.password);
		});

		it('wraps unexpected errors via resolveError and throws OrchardApiError', async () => {
			auth_service.validateSetupKey.mockRejectedValue(new Error('unexpected error'));
			error_service.resolveError.mockReturnValue(OrchardErrorCode.AuthenticationError);

			await expect(initialization_service.initialize('MY_TAG', mock_input)).rejects.toBeInstanceOf(OrchardApiError);

			const calls = error_service.resolveError.mock.calls;
			const [, , tag_arg, code_arg] = calls[calls.length - 1];
			expect(tag_arg).toBe('MY_TAG');
			expect(code_arg).toEqual({errord: OrchardErrorCode.AuthenticationError});
		});
	});

	describe('getInitialization', () => {
		it('returns OrchardInitialization with true when system needs initialization', async () => {
			auth_service.getInitialization.mockResolvedValue(true);

			const result = await initialization_service.getInitialization('TAG');

			expect(result).toBeInstanceOf(OrchardInitialization);
			expect(result.initialization).toBe(true);
			expect(auth_service.getInitialization).toHaveBeenCalled();
		});

		it('returns OrchardInitialization with false when system is already initialized', async () => {
			auth_service.getInitialization.mockResolvedValue(false);

			const result = await initialization_service.getInitialization('TAG');

			expect(result).toBeInstanceOf(OrchardInitialization);
			expect(result.initialization).toBe(false);
			expect(auth_service.getInitialization).toHaveBeenCalled();
		});

		it('wraps errors via resolveError and throws OrchardApiError', async () => {
			auth_service.getInitialization.mockRejectedValue(new Error('database error'));
			error_service.resolveError.mockReturnValue(OrchardErrorCode.AuthenticationError);

			await expect(initialization_service.getInitialization('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);

			const calls = error_service.resolveError.mock.calls;
			const [, , tag_arg, code_arg] = calls[calls.length - 1];
			expect(tag_arg).toBe('MY_TAG');
			expect(code_arg).toEqual({errord: OrchardErrorCode.AuthenticationError});
		});
	});
});
