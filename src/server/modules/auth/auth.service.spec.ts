// import {Test, TestingModule} from '@nestjs/testing';
// import {AuthService} from './auth.service';

// describe('AuthService', () => {
// 	let service: AuthService;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [AuthService],
// 		}).compile();

// 		service = module.get<AuthService>(AuthService);
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});
// });

import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '@server/modules/user/user.service';

describe('AuthService', () => {
	let auth_service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: JwtService, useValue: {signAsync: jest.fn(), verifyAsync: jest.fn()}},
				{provide: UserService, useValue: {getUser: jest.fn().mockResolvedValue({id: '1', name: 'Admin'})}},
			],
		}).compile();

		auth_service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(auth_service).toBeDefined();
	});
});
