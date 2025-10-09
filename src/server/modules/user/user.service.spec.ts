import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {UserService} from './user.service';

describe('UserService', () => {
	let user_service: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService],
		}).compile();

		user_service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(user_service).toBeDefined();
	});

	it('getUser returns the default admin user', () => {
		const user = user_service.getUser();
		expect(user).toEqual({id: '1', name: 'Admin'});
	});
});
