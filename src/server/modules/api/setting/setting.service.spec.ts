/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {SettingKey, SettingValue} from '@server/modules/setting/setting.enums';
import {NotificationService} from '@server/modules/notification/notification.service';
/* Local Dependencies */
import {ApiSettingService} from './setting.service';

/**
 * Test suite for ApiSettingService
 * Tests the API wrapper layer for settings
 */
describe('ApiSettingService', () => {
	let apiSettingService: ApiSettingService;
	let settingService: jest.Mocked<SettingService>;
	let errorService: jest.Mocked<ErrorService>;
	let notificationService: jest.Mocked<NotificationService>;

	// mock data for testing
	const mock_setting = {
		key: SettingKey.BITCOIN_ORACLE,
		value: 'true',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether the bitcoin oracle is enabled',
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ApiSettingService,
				{
					provide: SettingService,
					useValue: {
						getSettings: jest.fn(),
						updateSettings: jest.fn(),
					},
				},
				{
					provide: ErrorService,
					useValue: {
						resolveError: jest.fn(),
					},
				},
				{
					provide: NotificationService,
					useValue: {
						reinitialize: jest.fn(),
					},
				},
			],
		}).compile();

		apiSettingService = module.get<ApiSettingService>(ApiSettingService);
		settingService = module.get(SettingService);
		errorService = module.get(ErrorService);
		notificationService = module.get(NotificationService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test service instantiation
	 */
	it('should be defined', () => {
		expect(apiSettingService).toBeDefined();
	});

	/**
	 * Test getSettings method
	 */
	describe('getSettings', () => {
		it('should return settings wrapped in OrchardSetting models', async () => {
			// arrange
			const mock_settings = [mock_setting];
			settingService.getSettings.mockResolvedValue(mock_settings as any);

			// act
			const result = await apiSettingService.getSettings('TEST_TAG');

			// assert
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveProperty('key', SettingKey.BITCOIN_ORACLE);
			expect(settingService.getSettings).toHaveBeenCalledTimes(1);
		});

		it('should handle empty settings list', async () => {
			// arrange
			settingService.getSettings.mockResolvedValue([]);

			// act
			const result = await apiSettingService.getSettings('TEST_TAG');

			// assert
			expect(result).toEqual([]);
			expect(settingService.getSettings).toHaveBeenCalledTimes(1);
		});

		it('should wrap errors and throw OrchardApiError', async () => {
			// arrange
			const error = new Error('Database error');
			settingService.getSettings.mockRejectedValue(error);
			errorService.resolveError.mockReturnValue({code: OrchardErrorCode.SettingError});

			// act & assert
			await expect(apiSettingService.getSettings('ERROR_TAG')).rejects.toBeInstanceOf(OrchardApiError);
			expect(errorService.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.SettingError,
			});
		});
	});

	/**
	 * Test updateSettings method
	 */
	describe('updateSettings', () => {
		it('should update settings and return OrchardSetting models', async () => {
			// arrange
			const updated_setting = {...mock_setting, value: 'false'};
			settingService.updateSettings.mockResolvedValue([updated_setting] as any);

			// act
			const result = await apiSettingService.updateSettings('UPDATE_TAG', [SettingKey.BITCOIN_ORACLE], ['false']);

			// assert
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveProperty('key', SettingKey.BITCOIN_ORACLE);
			expect(result[0]).toHaveProperty('value', 'false');
			expect(settingService.updateSettings).toHaveBeenCalledWith([SettingKey.BITCOIN_ORACLE], ['false']);
		});

		it('should wrap errors and throw OrchardApiError', async () => {
			// arrange
			const error = new Error('Update failed');
			settingService.updateSettings.mockRejectedValue(error);
			errorService.resolveError.mockReturnValue({code: OrchardErrorCode.SettingError});

			// act & assert
			await expect(apiSettingService.updateSettings('ERROR_TAG', [SettingKey.BITCOIN_ORACLE], ['invalid'])).rejects.toBeInstanceOf(
				OrchardApiError,
			);
			expect(errorService.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.SettingError,
			});
		});

		it('should reinitialize notification service when notification keys are updated', async () => {
			// arrange
			settingService.updateSettings.mockResolvedValue([mock_setting] as any);

			// act
			await apiSettingService.updateSettings('TAG', [SettingKey.NOTIFICATIONS_ENABLED], ['true']);

			// assert
			expect(notificationService.reinitialize).toHaveBeenCalledTimes(1);
		});

		it('should not reinitialize notification service for non-notification keys', async () => {
			// arrange
			settingService.updateSettings.mockResolvedValue([mock_setting] as any);

			// act
			await apiSettingService.updateSettings('TAG', [SettingKey.BITCOIN_ORACLE], ['true']);

			// assert
			expect(notificationService.reinitialize).not.toHaveBeenCalled();
		});

		it('should pass correct parameters to underlying service', async () => {
			// arrange
			settingService.updateSettings.mockResolvedValue([mock_setting] as any);

			// act
			await apiSettingService.updateSettings('TAG', [SettingKey.BITCOIN_ORACLE], ['new_value']);

			// assert
			expect(settingService.updateSettings).toHaveBeenCalledTimes(1);
			expect(settingService.updateSettings).toHaveBeenCalledWith([SettingKey.BITCOIN_ORACLE], ['new_value']);
		});
	});
});
