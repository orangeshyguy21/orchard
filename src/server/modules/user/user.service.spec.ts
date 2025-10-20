import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {UserService} from './user.service';

describe('UserService', () => {
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService],
		}).compile();

		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	it('getUser returns the default admin user', () => {
		const user = userService.getUserByName('Admin');
		expect(user).toBeDefined();
	});
});
