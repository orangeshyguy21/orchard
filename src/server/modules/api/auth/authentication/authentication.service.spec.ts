/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {AuthenticationService} from './authentication.service';

describe('AuthenticationService', () => {
	let authentication_service: AuthenticationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				{provide: AuthService, useValue: {getToken: jest.fn(), refreshToken: jest.fn(), revokeToken: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		authentication_service = module.get<AuthenticationService>(AuthenticationService);
	});

	it('should be defined', () => {
		expect(authentication_service).toBeDefined();
	});
});
