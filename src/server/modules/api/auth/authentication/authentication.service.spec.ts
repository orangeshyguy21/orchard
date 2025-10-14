/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {AuthenticationService} from './authentication.service';
import {OrchardAuthentication} from './authentication.model';

describe('AuthenticationService', () => {
	let authentication_service: AuthenticationService;
	let auth_service: jest.Mocked<AuthService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				{provide: AuthService, useValue: {getToken: jest.fn(), refreshToken: jest.fn(), revokeToken: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		authentication_service = module.get<AuthenticationService>(AuthenticationService);
		auth_service = module.get(AuthService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(authentication_service).toBeDefined();
	});

	it('getToken returns OrchardAuthentication on success', async () => {
		auth_service.getToken.mockResolvedValue({access_token: 'a', refresh_token: 'r'} as any);
		const result = await authentication_service.getToken('TAG', {password: 'p'} as any);
		expect(result).toBeInstanceOf(OrchardAuthentication);
	});

	it('getToken wraps errors via resolveError and throws OrchardApiError', async () => {
		auth_service.getToken.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.AuthenticationError);
		await expect(authentication_service.getToken('MY_TAG', {password: 'p'} as any)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.AuthenticationError});
	});

	it('refreshToken returns OrchardAuthentication on success', async () => {
		auth_service.refreshToken.mockResolvedValue({access_token: 'a', refresh_token: 'r'} as any);
		const result = await authentication_service.refreshToken('TAG', 'r');
		expect(result).toBeInstanceOf(OrchardAuthentication);
	});

	it('revokeToken returns true on success', async () => {
		auth_service.revokeToken.mockResolvedValue(true as any);
		const result = await authentication_service.revokeToken('TAG', 'r');
		expect(result).toBe(true);
	});
});
