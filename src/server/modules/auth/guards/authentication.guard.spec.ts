/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {GqlAuthenticationGuard} from './authentication.guard';

describe('GqlAuthenticationGuard', () => {
	let guard: GqlAuthenticationGuard;
	let reflector: jest.Mocked<Reflector>;
	let configService: jest.Mocked<ConfigService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GqlAuthenticationGuard,
				{provide: Reflector, useValue: {getAllAndOverride: jest.fn()}},
				{provide: ConfigService, useValue: {get: jest.fn()}},
			],
		}).compile();

		guard = module.get<GqlAuthenticationGuard>(GqlAuthenticationGuard);
		reflector = module.get(Reflector);
		configService = module.get(ConfigService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	it('allows access when route is marked as public', () => {
		reflector.getAllAndOverride.mockReturnValueOnce(true);
		const context = {getHandler: jest.fn(), getClass: jest.fn()} as unknown as ExecutionContext;

		const result = guard.canActivate(context);

		expect(result).toBe(true);
	});

	it('allows access when route is marked as no_headers', () => {
		reflector.getAllAndOverride.mockReturnValueOnce(false).mockReturnValueOnce(true);
		const context = {getHandler: jest.fn(), getClass: jest.fn()} as unknown as ExecutionContext;

		const result = guard.canActivate(context);

		expect(result).toBe(true);
	});

	it('throws OrchardApiError when user is missing in production', () => {
		configService.get.mockReturnValue(true);
		const context = {getHandler: jest.fn(), getClass: jest.fn()} as unknown as ExecutionContext;

		expect(() => guard.handleRequest(null, null, null, context)).toThrow(OrchardApiError);
	});

	it('returns dev user when not in production and no auth header present', () => {
		configService.get.mockReturnValue(false);
		const mock_request = {headers: {}};
		jest.spyOn(guard, 'getRequest').mockReturnValue(mock_request);
		const context = {getHandler: jest.fn(), getClass: jest.fn()} as unknown as ExecutionContext;

		const result = guard.handleRequest(null, null, null, context);

		expect(result).toEqual({id: 'dev-user', name: 'dev', role: UserRole.ADMIN});
	});

	it('returns user when authentication succeeds', () => {
		configService.get.mockReturnValue(true);
		const mock_user = {id: '1', name: 'Alice', role: UserRole.ADMIN};
		const context = {getHandler: jest.fn(), getClass: jest.fn()} as unknown as ExecutionContext;

		const result = guard.handleRequest(null, mock_user, null, context);

		expect(result).toEqual(mock_user);
	});

	it('throws OrchardApiError when error is present', () => {
		configService.get.mockReturnValue(true);
		const context = {getHandler: jest.fn(), getClass: jest.fn()} as unknown as ExecutionContext;

		expect(() => guard.handleRequest(new Error('jwt expired'), null, null, context)).toThrow(OrchardApiError);
	});
});
