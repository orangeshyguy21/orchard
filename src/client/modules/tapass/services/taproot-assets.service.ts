/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {CacheService} from '@client/modules/cache/services/cache/cache.service';
import {ApiService} from '@client/modules/api/services/api/api.service';
/* Native Dependencies */
import {TaprootAssetInfo} from '@client/modules/tapass/classes/taproot-asset-info.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import {TaprootAssetInfoResponse, TaprootAssetResponse} from '@client/modules/tapass/types/taproot-assets.types';
/* Local Dependencies */
import {TAP_INFO_QUERY, TAP_ASSETS_QUERY} from './taproot-assets.queries';

@Injectable({
	providedIn: 'root',
})
export class TaprootAssetsService {
	public get tap_info$(): Observable<TaprootAssetInfo | null> {
		return this.tap_info_subject.asObservable();
	}

	public readonly CACHE_KEYS = {
		TAP_INFO: 'tap-info',
		TAP_ASSETS: 'tap-assets',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.TAP_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.TAP_ASSETS]: 5 * 60 * 1000, // 5 minutes
	};

	/* Subjects for caching */
	private readonly tap_info_subject: BehaviorSubject<TaprootAssetInfo | null>;
	private readonly tap_assets_subject: BehaviorSubject<TaprootAssets | null>;

	/* Observables for caching (rapid request caching) */
	private tap_info_observable!: Observable<TaprootAssetInfo> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
		private apiService: ApiService,
	) {
		this.tap_info_subject = this.cache.createCache<TaprootAssetInfo>(
			this.CACHE_KEYS.TAP_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.TAP_INFO],
		);
		this.tap_assets_subject = this.cache.createCache<TaprootAssets>(
			this.CACHE_KEYS.TAP_ASSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.TAP_ASSETS],
		);
	}

	public loadTaprootAssetsInfo(): Observable<TaprootAssetInfo> {
		if (this.tap_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.TAP_INFO)) return of(this.tap_info_subject.value);
		if (this.tap_info_observable) return this.tap_info_observable;

		const query = getApiQuery(TAP_INFO_QUERY);

		this.tap_info_observable = this.http.post<OrchardRes<TaprootAssetInfoResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.taproot_assets_info;
			}),
			map((tapInfo) => new TaprootAssetInfo(tapInfo)),
			tap((tapInfo) => {
				this.cache.updateCache(this.CACHE_KEYS.TAP_INFO, tapInfo);
				this.tap_info_subject.next(tapInfo);
				this.tap_info_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				console.error('Error loading taproot assets info:', error);
				this.tap_info_observable = null;
				return throwError(() => error);
			}),
		);

		return this.tap_info_observable;
	}

	public loadTaprootAssets(): Observable<TaprootAssets> {
		if (this.tap_assets_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.TAP_ASSETS)) {
			return of(this.tap_assets_subject.value);
		}

		const query = getApiQuery(TAP_ASSETS_QUERY);

		return this.http.post<OrchardRes<TaprootAssetResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.taproot_assets;
			}),
			map((tap_assets) => new TaprootAssets(tap_assets)),
			tap((tap_assets) => {
				this.cache.updateCache(this.CACHE_KEYS.TAP_ASSETS, tap_assets);
			}),
			catchError((error) => {
				console.error('Error loading taproot assets:', error);
				return throwError(() => error);
			}),
		);
	}
}
