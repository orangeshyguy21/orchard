/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
import {UserService} from '@server/modules/user/user.service';
import {InviteService} from '@server/modules/invite/invite.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {UserRole} from '@server/modules/user/user.enums';
import {User} from '@server/modules/user/user.entity';
import {Invite} from '@server/modules/invite/invite.entity';
/* Local Dependencies */
import {AuthSignupService} from './authsignup.service';
import {AuthSignupInput} from './authsignup.input';

describe('AuthSignupService', () => {
	let auth_signup_service: AuthSignupService;
	let auth_service: jest.Mocked<AuthService>;
	let error_service: jest.Mocked<ErrorService>;
	let user_service: jest.Mocked<UserService>;
	let invite_service: jest.Mocked<InviteService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthSignupService,
				{
					provide: AuthService,
					useValue: {
						getToken: jest.fn(),
					},
				},
				{
					provide: ErrorService,
					useValue: {
						resolveError: jest.fn(),
					},
				},
				{
					provide: UserService,
					useValue: {
						getUserByName: jest.fn(),
						createUser: jest.fn(),
					},
				},
				{
					provide: InviteService,
					useValue: {
						getValidInvite: jest.fn(),
						claimInvite: jest.fn(),
					},
				},
			],
		}).compile();

		auth_signup_service = module.get<AuthSignupService>(AuthSignupService);
		auth_service = module.get(AuthService);
		error_service = module.get(ErrorService);
		user_service = module.get(UserService);
		invite_service = module.get(InviteService);
	});

	it('should be defined', () => {
		expect(auth_signup_service).toBeDefined();
	});

	describe('signup', () => {
		it('successfully signs up user with valid invite', async () => {
			const signup_input: AuthSignupInput = {
				key: 'VALID123TOKN',
				name: 'NewUser',
				password: 'password123',
			};

			const mock_invite = {
				id: 'invite-id',
				token: 'VALID123TOKN',
				role: UserRole.READER,
				label: 'Test User',
				created_by: {id: 'admin1'} as User,
				used_at: null,
				expires_at: null,
				created_at: Math.floor(DateTime.now().toSeconds()),
			} as Invite;

			const mock_user = {
				id: 'new-user-id',
				name: 'NewUser',
				role: UserRole.READER,
				label: 'Test User',
				active: true,
				created_at: Math.floor(DateTime.now().toSeconds()),
			} as User;

			const mock_token = {
				access_token: 'access_token_123',
				refresh_token: 'refresh_token_456',
			};

			invite_service.getValidInvite.mockResolvedValue(mock_invite);
			user_service.getUserByName.mockResolvedValue(null);
			user_service.createUser.mockResolvedValue(mock_user);
			invite_service.claimInvite.mockResolvedValue(mock_invite);
			auth_service.getToken.mockResolvedValue(mock_token);

			const result = await auth_signup_service.signup('SIGNUP_TAG', signup_input);

			expect(result.access_token).toBe('access_token_123');
			expect(result.refresh_token).toBe('refresh_token_456');
			expect(invite_service.getValidInvite).toHaveBeenCalledWith('VALID123TOKN');
			expect(user_service.getUserByName).toHaveBeenCalledWith('NewUser');
			expect(user_service.createUser).toHaveBeenCalledWith('NewUser', 'password123', UserRole.READER, 'Test User');
			expect(invite_service.claimInvite).toHaveBeenCalledWith('invite-id', 'new-user-id');
			expect(auth_service.getToken).toHaveBeenCalledWith('new-user-id', 'password123');
		});

		it('throws OrchardApiError when invite is invalid', async () => {
			const signup_input: AuthSignupInput = {
				key: 'INVALID1TOKN',
				name: 'NewUser',
				password: 'password123',
			};

			invite_service.getValidInvite.mockResolvedValue(null);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.InviteInvalidError);

			await expect(auth_signup_service.signup('SIGNUP_TAG', signup_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(invite_service.getValidInvite).toHaveBeenCalledWith('INVALID1TOKN');
			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), OrchardErrorCode.InviteInvalidError, 'SIGNUP_TAG', {
				errord: OrchardErrorCode.SignupError,
			});
		});

		it('throws OrchardApiError when username already exists', async () => {
			const signup_input: AuthSignupInput = {
				key: 'VALID123TOKN',
				name: 'ExistingUser',
				password: 'password123',
			};

			const mock_invite = {
				id: 'invite-id',
				token: 'VALID123TOKN',
				role: UserRole.READER,
				label: 'Test User',
				created_by: {id: 'admin1'} as User,
			} as Invite;

			const existing_user = {
				id: 'existing-user-id',
				name: 'ExistingUser',
				role: UserRole.READER,
			} as User;

			invite_service.getValidInvite.mockResolvedValue(mock_invite);
			user_service.getUserByName.mockResolvedValue(existing_user);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.UniqueUsernameError);

			await expect(auth_signup_service.signup('SIGNUP_TAG', signup_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(user_service.getUserByName).toHaveBeenCalledWith('ExistingUser');
			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), OrchardErrorCode.UniqueUsernameError, 'SIGNUP_TAG', {
				errord: OrchardErrorCode.SignupError,
			});
		});

		it('throws OrchardApiError when token generation fails', async () => {
			const signup_input: AuthSignupInput = {
				key: 'VALID123TOKN',
				name: 'NewUser',
				password: 'password123',
			};

			const mock_invite = {
				id: 'invite-id',
				token: 'VALID123TOKN',
				role: UserRole.READER,
				label: 'Test User',
				created_by: {id: 'admin1'} as User,
			} as Invite;

			const mock_user = {
				id: 'new-user-id',
				name: 'NewUser',
				role: UserRole.READER,
			} as User;

			invite_service.getValidInvite.mockResolvedValue(mock_invite);
			user_service.getUserByName.mockResolvedValue(null);
			user_service.createUser.mockResolvedValue(mock_user);
			invite_service.claimInvite.mockResolvedValue(mock_invite);
			auth_service.getToken.mockResolvedValue(null as any);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.AuthenticationError);

			await expect(auth_signup_service.signup('SIGNUP_TAG', signup_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), OrchardErrorCode.AuthenticationError, 'SIGNUP_TAG', {
				errord: OrchardErrorCode.SignupError,
			});
		});

		it('throws OrchardApiError on unexpected errors', async () => {
			const signup_input: AuthSignupInput = {
				key: 'VALID123TOKN',
				name: 'NewUser',
				password: 'password123',
			};

			const error = new Error('Unexpected error');
			invite_service.getValidInvite.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.SignupError);

			await expect(auth_signup_service.signup('SIGNUP_TAG', signup_input)).rejects.toBeInstanceOf(OrchardApiError);

			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'SIGNUP_TAG', {
				errord: OrchardErrorCode.SignupError,
			});
		});
	});
});
