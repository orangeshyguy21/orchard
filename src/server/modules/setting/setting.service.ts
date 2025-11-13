/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
/* Local Dependencies */
import {Setting} from './setting.entity';
import {DEFAULT_SETTINGS} from './setting.config';
import {SettingKey} from './setting.enums';

@Injectable()
export class SettingService implements OnModuleInit {
	private readonly logger = new Logger(SettingService.name);

	constructor(
		@InjectRepository(Setting)
		private settingRepository: Repository<Setting>,
	) {}

	/**
	 * Initialize default settings on module startup
	 * This ensures all required settings exist in the database
	 */
	async onModuleInit(): Promise<void> {
		await this.initializeDefaults();
	}

	/**
	 * Initialize default settings if they don't exist
	 * @returns {Promise<void>}
	 */
	private async initializeDefaults(): Promise<void> {
		for (const default_setting of DEFAULT_SETTINGS) {
			const existing = await this.settingRepository.findOne({
				where: {key: default_setting.key},
			});
			if (existing) continue;
			const setting = this.settingRepository.create({
				key: default_setting.key,
				value: default_setting.value,
				value_type: default_setting.value_type,
				description: default_setting.description,
			});
			await this.settingRepository.save(setting);
			this.logger.debug(`Initialized default setting: ${default_setting.key}`);
		}
	}

	/**
	 * Get all settings
	 * @returns {Promise<Setting[]>} All settings
	 */
	public async getSettings(): Promise<Setting[]> {
		return this.settingRepository.find();
	}

	/**
	 * Update a setting by key
	 * @param {SettingKey} key - The setting key to update
	 * @param {string} value - The new value for the setting
	 * @returns {Promise<Setting>} The updated setting
	 */
	public async updateSetting(key: SettingKey, value: string): Promise<Setting> {
		const setting = await this.settingRepository.findOne({
			where: {key},
		});
		if (!setting) throw new Error(`Setting with key ${key} not found`);
		setting.value = value;
		const updated_setting = await this.settingRepository.save(setting);
		this.logger.debug(`Updated setting: ${key} = ${value}`);
		return updated_setting;
	}
}
