/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {Observable, map, tap, catchError, throwError} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {ApiService} from '@client/modules/api/services/api/api.service';
/* Native Dependencies */
import {Setting} from '@client/modules/settings/classes/setting.class';
import {SettingsResponse, SettingsUpdateResponse} from '@client/modules/settings/types/setting-app.types';
/* Local Dependencies */
import {SETTINGS_QUERY, SETTINGS_UPDATE_MUTATION} from './setting-app.queries';
/* Shared Dependencies */
import {SettingKey, SettingValue} from '@shared/generated.types';

export interface ParsedAppSettings {
	bitcoin_oracle: boolean;
	ai_enabled: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class SettingAppService {
	private parsed_settings: ParsedAppSettings = {
		bitcoin_oracle: false,
		ai_enabled: false,
	};

	constructor(
		private http: HttpClient,
		private apiService: ApiService,
	) {}

	public loadSettings(): Observable<Setting[]> {
		const query = getApiQuery(SETTINGS_QUERY);
		return this.http.post<OrchardRes<SettingsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.settings;
			}),
			map((settings) => settings.map((setting) => new Setting(setting))),
			tap((settings) => {
				this.updateParsedSettings(settings);
			}),
			catchError((error) => {
				return throwError(() => error);
			}),
		);
	}

	/**
	 * Update multiple settings in a single request
	 * @param {SettingKey[]} keys - The setting keys to update
	 * @param {string[]} values - The new values for the settings
	 * @returns {Observable<Setting[]>} The updated settings
	 */
	public updateSettings(keys: SettingKey[], values: string[]): Observable<Setting[]> {
		const query = getApiQuery(SETTINGS_UPDATE_MUTATION, {keys, values});
		return this.http.post<OrchardRes<SettingsUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.settings_update;
			}),
			map((settings) => settings.map((setting) => new Setting(setting))),
			tap((updated_settings) => {
				this.updateParsedSettings(updated_settings);
			}),
			catchError((error) => {
				return throwError(() => error);
			}),
		);
	}

	/**
	 * Parse a setting value based on its type
	 * @param {string} value - The string value to parse
	 * @param {SettingValue} value_type - The type of the value
	 * @returns {boolean | number | string | any} The parsed value
	 */
	public parseSettingValue(setting: Setting): boolean | number | string | any {
		switch (setting.value_type) {
			case SettingValue.Boolean:
				return setting.value === 'true';
			case SettingValue.Number:
				return Number(setting.value);
			case SettingValue.Json:
				try {
					return JSON.parse(setting.value);
				} catch (error) {
					console.error('Failed to parse JSON setting value:', error);
					return null;
				}
			case SettingValue.String:
			default:
				return setting.value;
		}
	}

	/**
	 * Get a specific parsed setting value
	 */
	public getSetting<K extends keyof ParsedAppSettings>(key: K): ParsedAppSettings[K] {
		return this.parsed_settings[key];
	}

	/**
	 * Get a copy of all parsed settings
	 */
	public getParsedSettings(): ParsedAppSettings {
		return {...this.parsed_settings};
	}

	/**
	 * Update the parsed settings cache from raw settings
	 */
	private updateParsedSettings(settings: Setting[]): void {
		const bitcoin_oracle = settings.find((s) => s.key === SettingKey.BitcoinOracle);
		const ai_enabled = settings.find((s) => s.key === SettingKey.AiEnabled);

		if (bitcoin_oracle) this.parsed_settings.bitcoin_oracle = this.parseSettingValue(bitcoin_oracle);
		if (ai_enabled) this.parsed_settings.ai_enabled = this.parseSettingValue(ai_enabled);
	}
}
