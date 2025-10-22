import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {AuthService} from './auth.service';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '@server/modules/user/user.service';
import {UnauthorizedException} from '@nestjs/common';

describe('AuthService', () => {
	let authService: AuthService;
	let jwtService: jest.Mocked<JwtService>;
	let userService: jest.Mocked<UserService>;

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

		authService = module.get<AuthService>(AuthService);

		jwtService = module.get(JwtService);
		userService = module.get(UserService);
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});

	it('getToken returns tokens when password matches', async () => {
		jwtService.signAsync.mockResolvedValueOnce('a');
		jwtService.signAsync.mockResolvedValueOnce('r');
		const result = await authService.getToken('1', 'password');
		expect(result).toEqual({access_token: 'a', refresh_token: 'r'});
	});

	it('getToken throws UnauthorizedException on bad password', async () => {
		userService.validatePassword.mockResolvedValueOnce(false);
		await expect(authService.getToken('1', 'wrong_password')).rejects.toBeInstanceOf(UnauthorizedException);
	});

	it('refreshToken issues new tokens when valid', async () => {
		jwtService.verifyAsync.mockResolvedValue({type: 'refresh', sub: '1', username: 'Admin'} as any);
		jwtService.signAsync.mockResolvedValueOnce('a2');
		jwtService.signAsync.mockResolvedValueOnce('r2');
		const result = await authService.refreshToken('refresh');
		expect(result).toEqual({access_token: 'a2', refresh_token: 'r2'});
	});

	it('revokeToken adds token to blacklist for valid refresh token', async () => {
		jwtService.verifyAsync.mockResolvedValue({type: 'refresh', sub: '1', username: 'Admin'} as any);
		const ok = await authService.revokeToken('refresh');
		expect(ok).toBe(true);
	});

	it('validateAccessToken returns payload when valid', async () => {
		jwtService.verifyAsync.mockResolvedValue({type: 'access', sub: '1'} as any);
		const payload = await authService.validateAccessToken('access');
		expect(payload.sub).toBe('1');
	});
});
