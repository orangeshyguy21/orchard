import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {AuthService} from './auth.service';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '@server/modules/user/user.service';
import {UnauthorizedException} from '@nestjs/common';

describe('AuthService', () => {
	let auth_service: AuthService;
	let config_service: jest.Mocked<ConfigService>;
	let jwt_service: jest.Mocked<JwtService>;
	let _user_service: jest.Mocked<UserService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: JwtService, useValue: {signAsync: jest.fn(), verifyAsync: jest.fn()}},
				{
					provide: UserService,
					useValue: {
						getUserById: jest.fn().mockResolvedValue({id: '1', name: 'Admin'}),
						validatePassword: jest.fn().mockResolvedValue(true),
						getUserCount: jest.fn().mockResolvedValue(1),
					},
				},
			],
		}).compile();

		auth_service = module.get<AuthService>(AuthService);
		config_service = module.get(ConfigService);
		jwt_service = module.get(JwtService);
		_user_service = module.get(UserService);
	});

	it('should be defined', () => {
		expect(auth_service).toBeDefined();
	});

	it('getToken returns tokens when password matches', async () => {
		jwt_service.signAsync.mockResolvedValueOnce('a');
		jwt_service.signAsync.mockResolvedValueOnce('r');
		const result = await auth_service.getToken('1', 'password');
		expect(result).toEqual({access_token: 'a', refresh_token: 'r'});
	});

	it('getToken throws UnauthorizedException on bad password', async () => {
		_user_service.validatePassword.mockResolvedValueOnce(false);
		await expect(auth_service.getToken('1', 'wrong_password')).rejects.toBeInstanceOf(UnauthorizedException);
	});

	it('refreshToken issues new tokens when valid', async () => {
		jwt_service.verifyAsync.mockResolvedValue({type: 'refresh', sub: '1', username: 'Admin'} as any);
		jwt_service.signAsync.mockResolvedValueOnce('a2');
		jwt_service.signAsync.mockResolvedValueOnce('r2');
		const result = await auth_service.refreshToken('refresh');
		expect(result).toEqual({access_token: 'a2', refresh_token: 'r2'});
	});

	it('revokeToken adds token to blacklist for valid refresh token', async () => {
		jwt_service.verifyAsync.mockResolvedValue({type: 'refresh', sub: '1', username: 'Admin'} as any);
		const ok = await auth_service.revokeToken('refresh');
		expect(ok).toBe(true);
	});

	it('validateAccessToken returns payload when valid', async () => {
		jwt_service.verifyAsync.mockResolvedValue({type: 'access', sub: '1'} as any);
		const payload = await auth_service.validateAccessToken('access');
		expect(payload.sub).toBe('1');
	});
});
