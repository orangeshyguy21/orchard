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
	let api_setting_service: ApiSettingService;
	let setting_service: jest.Mocked<SettingService>;
	let error_service: jest.Mocked<ErrorService>;

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

		api_setting_service = module.get<ApiSettingService>(ApiSettingService);
		setting_service = module.get(SettingService);
		error_service = module.get(ErrorService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test service instantiation
	 */
	it('should be defined', () => {
		expect(api_setting_service).toBeDefined();
	});

	/**
	 * Test getSettings method
	 */
	describe('getSettings', () => {
		it('should return settings wrapped in OrchardSetting models', async () => {
			// arrange
			const mock_settings = [mock_setting];
			setting_service.getSettings.mockResolvedValue(mock_settings as any);

			// act
			const result = await api_setting_service.getSettings('TEST_TAG');

			// assert
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveProperty('key', SettingKey.BITCOIN_ORACLE);
			expect(setting_service.getSettings).toHaveBeenCalledTimes(1);
		});

		it('should handle empty settings list', async () => {
			// arrange
			setting_service.getSettings.mockResolvedValue([]);

			// act
			const result = await api_setting_service.getSettings('TEST_TAG');

			// assert
			expect(result).toEqual([]);
			expect(setting_service.getSettings).toHaveBeenCalledTimes(1);
		});

		it('should wrap errors and throw OrchardApiError', async () => {
			// arrange
			const error = new Error('Database error');
			setting_service.getSettings.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.SettingError);

			// act & assert
			await expect(api_setting_service.getSettings('ERROR_TAG')).rejects.toBeInstanceOf(OrchardApiError);
			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
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
			setting_service.updateSetting.mockResolvedValue(updated_setting as any);

			// act
			const result = await api_setting_service.updateSetting('UPDATE_TAG', SettingKey.BITCOIN_ORACLE, 'false');

			// assert
			expect(result).toHaveProperty('key', SettingKey.BITCOIN_ORACLE);
			expect(result).toHaveProperty('value', 'false');
			expect(setting_service.updateSetting).toHaveBeenCalledWith(SettingKey.BITCOIN_ORACLE, 'false');
		});

		it('should wrap errors and throw OrchardApiError', async () => {
			// arrange
			const error = new Error('Update failed');
			setting_service.updateSetting.mockRejectedValue(error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.SettingError);

			// act & assert
			await expect(api_setting_service.updateSetting('ERROR_TAG', SettingKey.BITCOIN_ORACLE, 'invalid')).rejects.toBeInstanceOf(
				OrchardApiError,
			);
			expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'ERROR_TAG', {
				errord: OrchardErrorCode.SettingError,
			});
		});

		it('should pass correct parameters to underlying service', async () => {
			// arrange
			setting_service.updateSetting.mockResolvedValue(mock_setting as any);

			// act
			await api_setting_service.updateSetting('TAG', SettingKey.BITCOIN_ORACLE, 'new_value');

			// assert
			expect(setting_service.updateSetting).toHaveBeenCalledTimes(1);
			expect(setting_service.updateSetting).toHaveBeenCalledWith(SettingKey.BITCOIN_ORACLE, 'new_value');
		});
	});
});
