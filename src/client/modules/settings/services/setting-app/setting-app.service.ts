/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {Observable, map, catchError, throwError} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {ApiService} from '@client/modules/api/services/api/api.service';
/* Native Dependencies */
import {Setting} from '@client/modules/settings/classes/setting.class';
import {AppSettingsResponse} from '@client/modules/settings/types/setting-app.types';
/* Local Dependencies */
import {SETTINGS_QUERY} from './setting-app.queries';
/* Shared Dependencies */
import {SettingValue} from '@shared/generated.types';

@Injectable({
	providedIn: 'root',
})
export class SettingAppService {
	constructor(
		private http: HttpClient,
		private apiService: ApiService,
	) {}

	public getSettings(): Observable<Setting[]> {
		const query = getApiQuery(SETTINGS_QUERY);
		return this.http.post<OrchardRes<AppSettingsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.settings;
			}),
			map((settings) => settings.map((setting) => new Setting(setting))),
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
}
