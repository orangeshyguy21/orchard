/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {AuthService} from '@server/modules/auth/auth.service';
import {SettingService} from '@server/modules/setting/setting.service';
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
/* Local Dependencies */
import {TaskService} from './task.service';

describe('TaskService', () => {
	let task_service: TaskService;
	let auth_service: jest.Mocked<AuthService>;
	let logger_spy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaskService,
				{
					provide: AuthService,
					useValue: {
						cleanupExpiredTokens: jest.fn(),
					},
				},
				{
					provide: SettingService,
					useValue: {
						getSetting: jest.fn(),
					},
				},
				{
					provide: BitcoinRpcService,
					useValue: {
						getBitcoinBlockchainInfo: jest.fn(),
					},
				},
				{
					provide: BitcoinUTXOracleService,
					useValue: {
						runOracle: jest.fn(),
						saveOraclePrice: jest.fn(),
					},
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn(),
					},
				},
			],
		}).compile();

		task_service = module.get<TaskService>(TaskService);
		auth_service = module.get(AuthService);

		// Spy on logger methods
		logger_spy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
		jest.spyOn(Logger.prototype, 'error').mockImplementation();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(task_service).toBeDefined();
	});

	describe('cleanupExpiredTokens', () => {
		it('should cleanup tokens and log success', async () => {
			// Arrange
			const expected_count = 42;
			auth_service.cleanupExpiredTokens.mockResolvedValue(expected_count);

			// Act
			await task_service.cleanupExpiredTokens();

			// Assert
			expect(auth_service.cleanupExpiredTokens).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenCalledWith('Starting expired token cleanup...');
			expect(logger_spy).toHaveBeenCalledWith(`Cleaned up ${expected_count} expired tokens`);
		});

		it('should log zero when no tokens are cleaned up', async () => {
			// Arrange
			auth_service.cleanupExpiredTokens.mockResolvedValue(0);

			// Act
			await task_service.cleanupExpiredTokens();

			// Assert
			expect(auth_service.cleanupExpiredTokens).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenCalledWith('Cleaned up 0 expired tokens');
		});

		it('should log error when cleanup fails', async () => {
			// Arrange
			const error = new Error('Database connection failed');
			auth_service.cleanupExpiredTokens.mockRejectedValue(error);
			const error_spy = jest.spyOn(Logger.prototype, 'error');

			// Act
			await task_service.cleanupExpiredTokens();

			// Assert
			expect(auth_service.cleanupExpiredTokens).toHaveBeenCalledTimes(1);
			expect(error_spy).toHaveBeenCalledWith('Error cleaning up tokens: Database connection failed');
		});
	});
});
