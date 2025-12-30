/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {SettingKey, SettingValue} from '@server/modules/setting/setting.enums';
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
						updateSetting: jest.fn(),
					},
				},
				{
					provide: ErrorService,
					useValue: {
						resolveError: jest.fn(),
					},
				},
			],
		}).compile();

		apiSettingService = module.get<ApiSettingService>(ApiSettingService);
		settingService = module.get(SettingService);
		errorService = module.get(ErrorService);
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
	 * Test updateSetting method
	 */
	describe('updateSetting', () => {
		it('should update setting and return OrchardSetting model', async () => {
			// arrange
			const updated_setting = {...mock_setting, value: 'false'};
			settingService.updateSetting.mockResolvedValue(updated_setting as any);

			// act
			const result = await apiSettingService.updateSetting('UPDATE_TAG', SettingKey.BITCOIN_ORACLE, 'false');

			// assert
			expect(result).toHaveProperty('key', SettingKey.BITCOIN_ORACLE);
			expect(result).toHaveProperty('value', 'false');
			expect(settingService.updateSetting).toHaveBeenCalledWith(SettingKey.BITCOIN_ORACLE, 'false');
		});

		it('should wrap errors and throw OrchardApiError', async () => {
			// arrange
			const error = new Error('Update failed');
			settingService.updateSetting.mockRejectedValue(error);
			errorService.resolveError.mockReturnValue({code: OrchardErrorCode.SettingError});

			// act & assert
			await expect(apiSettingService.updateSetting('ERROR_TAG', SettingKey.BITCOIN_ORACLE, 'invalid')).rejects.toBeInstanceOf(
				OrchardApiError,
			);
			expect(errorService.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.SettingError,
			});
		});

		it('should pass correct parameters to underlying service', async () => {
			// arrange
			settingService.updateSetting.mockResolvedValue(mock_setting as any);

			// act
			await apiSettingService.updateSetting('TAG', SettingKey.BITCOIN_ORACLE, 'new_value');

			// assert
			expect(settingService.updateSetting).toHaveBeenCalledTimes(1);
			expect(settingService.updateSetting).toHaveBeenCalledWith(SettingKey.BITCOIN_ORACLE, 'new_value');
		});
	});
});
