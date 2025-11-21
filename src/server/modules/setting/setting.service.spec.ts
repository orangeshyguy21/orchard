/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {getRepositoryToken} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
/* Local Dependencies */
import {SettingService} from './setting.service';
import {Setting} from './setting.entity';
import {SettingKey, SettingValue} from './setting.enums';
import {DEFAULT_SETTINGS} from './setting.config';

/**
 * Test suite for SettingService
 * Tests all public methods and initialization logic
 */
describe('SettingService', () => {
	let service: SettingService;
	let _repository: Repository<Setting>;

	// mock data for testing
	const mock_setting: Setting = {
		key: SettingKey.BITCOIN_ORACLE,
		value: 'true',
		value_type: SettingValue.BOOLEAN,
		description: 'Whether the bitcoin oracle is enabled',
	};

	const mock_repository = {
		findOne: jest.fn(),
		find: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
	};

	beforeEach(async () => {
		// reset all mocks before each test
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SettingService,
				{
					provide: getRepositoryToken(Setting),
					useValue: mock_repository,
				},
			],
		}).compile();

		service = module.get<SettingService>(SettingService);
		_repository = module.get<Repository<Setting>>(getRepositoryToken(Setting));
	});

	/**
	 * Test service instantiation
	 */
	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	/**
	 * Test onModuleInit lifecycle hook
	 */
	describe('onModuleInit', () => {
		it('should initialize default settings when module initializes', async () => {
			// arrange
			mock_repository.findOne.mockResolvedValue(null);
			mock_repository.create.mockReturnValue(mock_setting);
			mock_repository.save.mockResolvedValue(mock_setting);

			// act
			await service.onModuleInit();

			// assert
			expect(mock_repository.findOne).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length);
			expect(mock_repository.create).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length);
			expect(mock_repository.save).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length);
		});

		it('should not duplicate existing settings', async () => {
			// arrange
			mock_repository.findOne.mockResolvedValue(mock_setting);

			// act
			await service.onModuleInit();

			// assert
			expect(mock_repository.findOne).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length);
			expect(mock_repository.create).not.toHaveBeenCalled();
			expect(mock_repository.save).not.toHaveBeenCalled();
		});

		it('should initialize only missing default settings', async () => {
			// arrange - first setting exists, others don't
			mock_repository.findOne
				.mockResolvedValueOnce(mock_setting) // first call returns existing
				.mockResolvedValue(null); // subsequent calls return null
			mock_repository.create.mockReturnValue(mock_setting);
			mock_repository.save.mockResolvedValue(mock_setting);

			// act
			await service.onModuleInit();

			// assert
			expect(mock_repository.findOne).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length);
			expect(mock_repository.create).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length - 1);
			expect(mock_repository.save).toHaveBeenCalledTimes(DEFAULT_SETTINGS.length - 1);
		});
	});

	/**
	 * Test getSettings method
	 */
	describe('getSettings', () => {
		it('should return all settings', async () => {
			// arrange
			const mock_settings = [mock_setting];
			mock_repository.find.mockResolvedValue(mock_settings);

			// act
			const result = await service.getSettings();

			// assert
			expect(result).toEqual(mock_settings);
			expect(mock_repository.find).toHaveBeenCalledTimes(1);
		});

		it('should return empty array when no settings exist', async () => {
			// arrange
			mock_repository.find.mockResolvedValue([]);

			// act
			const result = await service.getSettings();

			// assert
			expect(result).toEqual([]);
			expect(mock_repository.find).toHaveBeenCalledTimes(1);
		});
	});

	/**
	 * Test getSetting method
	 */
	describe('getSetting', () => {
		it('should return a setting by key', async () => {
			// arrange
			mock_repository.findOne.mockResolvedValue(mock_setting);

			// act
			const result = await service.getSetting(SettingKey.BITCOIN_ORACLE);

			// assert
			expect(result).toEqual(mock_setting);
			expect(mock_repository.findOne).toHaveBeenCalledWith({
				where: {key: SettingKey.BITCOIN_ORACLE},
			});
		});

		it('should return null when setting does not exist', async () => {
			// arrange
			mock_repository.findOne.mockResolvedValue(null);

			// act
			const result = await service.getSetting(SettingKey.BITCOIN_ORACLE);

			// assert
			expect(result).toBeNull();
			expect(mock_repository.findOne).toHaveBeenCalledWith({
				where: {key: SettingKey.BITCOIN_ORACLE},
			});
		});
	});

	/**
	 * Test updateSetting method
	 */
	describe('updateSetting', () => {
		it('should update a setting value', async () => {
			// arrange
			const updated_value = 'false';
			const updated_setting = {...mock_setting, value: updated_value};
			mock_repository.findOne.mockResolvedValue(mock_setting);
			mock_repository.save.mockResolvedValue(updated_setting);

			// act
			const result = await service.updateSetting(SettingKey.BITCOIN_ORACLE, updated_value);

			// assert
			expect(result.value).toBe(updated_value);
			expect(mock_repository.findOne).toHaveBeenCalledWith({
				where: {key: SettingKey.BITCOIN_ORACLE},
			});
			expect(mock_repository.save).toHaveBeenCalledWith({
				...mock_setting,
				value: updated_value,
			});
		});

		it('should throw error when setting does not exist', async () => {
			// arrange
			mock_repository.findOne.mockResolvedValue(null);

			// act & assert
			await expect(service.updateSetting(SettingKey.BITCOIN_ORACLE, 'false')).rejects.toThrow(
				`Setting with key ${SettingKey.BITCOIN_ORACLE} not found`,
			);
			expect(mock_repository.findOne).toHaveBeenCalledWith({
				where: {key: SettingKey.BITCOIN_ORACLE},
			});
			expect(mock_repository.save).not.toHaveBeenCalled();
		});

		it('should handle updating to empty string', async () => {
			// arrange
			const updated_value = '';
			const updated_setting = {...mock_setting, value: updated_value};
			mock_repository.findOne.mockResolvedValue(mock_setting);
			mock_repository.save.mockResolvedValue(updated_setting);

			// act
			const result = await service.updateSetting(SettingKey.BITCOIN_ORACLE, updated_value);

			// assert
			expect(result.value).toBe(updated_value);
			expect(mock_repository.save).toHaveBeenCalled();
		});

		it('should persist the updated setting in the database', async () => {
			// arrange
			const new_value = 'updated_value';
			mock_repository.findOne.mockResolvedValue(mock_setting);
			mock_repository.save.mockResolvedValue({...mock_setting, value: new_value});

			// act
			await service.updateSetting(SettingKey.BITCOIN_ORACLE, new_value);

			// assert
			expect(mock_repository.save).toHaveBeenCalledTimes(1);
			expect(mock_repository.save).toHaveBeenCalledWith(
				expect.objectContaining({
					key: SettingKey.BITCOIN_ORACLE,
					value: new_value,
				}),
			);
		});
	});
});
