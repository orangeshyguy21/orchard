/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {Observable, map, tap, catchError, throwError, BehaviorSubject, of} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {ApiService} from '@client/modules/api/services/api/api.service';
import {CacheService} from '@client/modules/cache/services/cache/cache.service';
/* Native Dependencies */
import {Setting} from '@client/modules/settings/classes/setting.class';
import {SettingsResponse, SettingUpdateResponse} from '@client/modules/settings/types/setting-app.types';
/* Local Dependencies */
import {SETTINGS_QUERY, SETTING_UPDATE_MUTATION} from './setting-app.queries';
/* Shared Dependencies */
import {SettingKey, SettingValue} from '@shared/generated.types';

@Injectable({
	providedIn: 'root',
})
export class SettingAppService {
	public get settings$(): Observable<Setting[] | null> {
		return this.settings_subject.asObservable();
	}

	public readonly CACHE_KEYS = {
		SETTINGS: 'settings',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.SETTINGS]: 60 * 60 * 1000, // 60 minutes
	};

	private readonly settings_subject: BehaviorSubject<Setting[] | null>;

	constructor(
		private http: HttpClient,
		private apiService: ApiService,
		private cache: CacheService,
	) {
		this.settings_subject = this.cache.createCache<Setting[]>(this.CACHE_KEYS.SETTINGS, this.CACHE_DURATIONS[this.CACHE_KEYS.SETTINGS]);
	}

	public loadSettings(): Observable<Setting[]> {
		if (this.settings_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.SETTINGS)) {
			return of(this.settings_subject.value);
		}
		const query = getApiQuery(SETTINGS_QUERY);
		return this.http.post<OrchardRes<SettingsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.settings;
			}),
			map((settings) => settings.map((setting) => new Setting(setting))),
			tap((settings) => {
				this.cache.updateCache(this.CACHE_KEYS.SETTINGS, settings);
				this.settings_subject.next(settings);
			}),
			catchError((error) => {
				return throwError(() => error);
			}),
		);
	}

	public updateSetting(key: SettingKey, value: string): Observable<Setting> {
		const query = getApiQuery(SETTING_UPDATE_MUTATION, {key, value});
		return this.http.post<OrchardRes<SettingUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.setting_update;
			}),
			map((setting) => new Setting(setting)),
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
