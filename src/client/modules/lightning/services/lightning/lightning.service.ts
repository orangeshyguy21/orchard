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
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningAccount} from '@client/modules/lightning/classes/lightning-account.class';
import {LightningChannel, LightningClosedChannel} from '@client/modules/lightning/classes/lightning-channel.class';
import {LightningRequest} from '@client/modules/lightning/classes/lightning-request.class';
import {LightningAnalytic} from '@client/modules/lightning/classes/lightning-analytic.class';
import {LightningAnalyticsBackfillStatus} from '@client/modules/lightning/classes/lightning-analytics-backfill-status.class';
import {
	LightningInfoResponse,
	LightningBalanceResponse,
	LightningWalletResponse,
	LightningChannelsResponse,
	LightningClosedChannelsResponse,
	LightningRequestResponse,
	LightningAnalyticsResponse,
	LightningAnalyticsBackfillStatusResponse,
	LightningAnalyticsArgs,
} from '@client/modules/lightning/types/lightning.types';
/* Shared Dependencies */
import {LightningAnalyticsInterval} from '@shared/generated.types';
/* Local Dependencies */
import {
	LIGHTNING_INFO_QUERY,
	LIGHTNING_BALANCE_QUERY,
	LIGHTNING_WALLET_QUERY,
	LIGHTNING_REQUEST_QUERY,
	LIGHTNING_CHANNELS_QUERY,
	LIGHTNING_CLOSED_CHANNELS_QUERY,
	LIGHTNING_ANALYTICS_QUERY,
	LIGHTNING_ANALYTICS_BACKFILL_STATUS_QUERY,
} from './lightning.queries';

@Injectable({
	providedIn: 'root',
})
export class LightningService {
	public get lightning_info$(): Observable<LightningInfo | null> {
		return this.lightning_info_subject.asObservable();
	}

	public readonly CACHE_KEYS = {
		LIGHTNING_INFO: 'lightning-info',
		LIGHTNING_BALANCE: 'lightning-balance',
		LIGHTNING_ACCOUNTS: 'lightning-accounts',
		LIGHTNING_CHANNELS: 'lightning-channels',
		LIGHTNING_CLOSED_CHANNELS: 'lightning-closed-channels',
		LIGHTNING_ANALYTICS: 'lightning-analytics',
		LIGHTNING_ANALYTICS_PRE: 'lightning-analytics-pre',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.LIGHTNING_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.LIGHTNING_BALANCE]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.LIGHTNING_ACCOUNTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.LIGHTNING_CHANNELS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.LIGHTNING_CLOSED_CHANNELS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.LIGHTNING_ANALYTICS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.LIGHTNING_ANALYTICS_PRE]: 5 * 60 * 1000, // 5 minutes
	};

	/* Subjects for caching */
	private readonly lightning_info_subject: BehaviorSubject<LightningInfo | null>;
	private readonly lightning_balance_subject: BehaviorSubject<LightningBalance | null>;
	private readonly lightning_accounts_subject: BehaviorSubject<LightningAccount[] | null>;
	private readonly lightning_channels_subject: BehaviorSubject<LightningChannel[] | null>;
	private readonly lightning_closed_channels_subject: BehaviorSubject<LightningClosedChannel[] | null>;
	private readonly lightning_analytics_subject: BehaviorSubject<LightningAnalytic[] | null>;
	private readonly lightning_analytics_pre_subject: BehaviorSubject<LightningAnalytic[] | null>;

	/* Observables for caching (rapid request caching) */
	private lightning_info_observable!: Observable<LightningInfo> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
		private apiService: ApiService,
	) {
		this.lightning_info_subject = this.cache.createCache<LightningInfo>(
			this.CACHE_KEYS.LIGHTNING_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_INFO],
		);
		this.lightning_balance_subject = this.cache.createCache<LightningBalance>(
			this.CACHE_KEYS.LIGHTNING_BALANCE,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_BALANCE],
		);
		this.lightning_accounts_subject = this.cache.createCache<LightningAccount[]>(
			this.CACHE_KEYS.LIGHTNING_ACCOUNTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_ACCOUNTS],
		);
		this.lightning_channels_subject = this.cache.createCache<LightningChannel[]>(
			this.CACHE_KEYS.LIGHTNING_CHANNELS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_CHANNELS],
		);
		this.lightning_closed_channels_subject = this.cache.createCache<LightningClosedChannel[]>(
			this.CACHE_KEYS.LIGHTNING_CLOSED_CHANNELS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_CLOSED_CHANNELS],
		);
		this.lightning_analytics_subject = this.cache.createCache<LightningAnalytic[]>(
			this.CACHE_KEYS.LIGHTNING_ANALYTICS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_ANALYTICS],
		);
		this.lightning_analytics_pre_subject = this.cache.createCache<LightningAnalytic[]>(
			this.CACHE_KEYS.LIGHTNING_ANALYTICS_PRE,
			this.CACHE_DURATIONS[this.CACHE_KEYS.LIGHTNING_ANALYTICS_PRE],
		);
	}

	public clearAnalyticsCache(): void {
		this.cache.clearCache(this.CACHE_KEYS.LIGHTNING_ANALYTICS);
		this.cache.clearCache(this.CACHE_KEYS.LIGHTNING_ANALYTICS_PRE);
	}

	public loadLightningInfo(): Observable<LightningInfo> {
		if (this.lightning_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.LIGHTNING_INFO))
			return of(this.lightning_info_subject.value);
		if (this.lightning_info_observable) return this.lightning_info_observable;

		const query = getApiQuery(LIGHTNING_INFO_QUERY);

		this.lightning_info_observable = this.http.post<OrchardRes<LightningInfoResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_info;
			}),
			map((lnInfo) => new LightningInfo(lnInfo)),
			tap((lnInfo) => {
				this.cache.updateCache(this.CACHE_KEYS.LIGHTNING_INFO, lnInfo);
				this.lightning_info_subject.next(lnInfo);
				this.lightning_info_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				console.error('Error loading lightning info:', error);
				this.lightning_info_observable = null;
				this.lightning_info_subject.next(null);
				return throwError(() => error);
			}),
		);

		return this.lightning_info_observable;
	}

	public loadLightningBalance(): Observable<LightningBalance> {
		if (this.lightning_balance_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.LIGHTNING_BALANCE)) {
			return of(this.lightning_balance_subject.value);
		}

		const query = getApiQuery(LIGHTNING_BALANCE_QUERY);

		return this.http.post<OrchardRes<LightningBalanceResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_balance;
			}),
			map((ln_balance) => new LightningBalance(ln_balance)),
			tap((ln_balance) => {
				this.cache.updateCache(this.CACHE_KEYS.LIGHTNING_BALANCE, ln_balance);
			}),
			catchError((error) => {
				console.error('Error loading lightning balance:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadLightningAccounts(): Observable<LightningAccount[]> {
		if (this.lightning_accounts_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.LIGHTNING_ACCOUNTS)) {
			return of(this.lightning_accounts_subject.value);
		}

		const query = getApiQuery(LIGHTNING_WALLET_QUERY);

		return this.http.post<OrchardRes<LightningWalletResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_wallet;
			}),
			map((ln_wallet) => ln_wallet.map((ln_account) => new LightningAccount(ln_account))),
			tap((ln_wallet) => {
				this.cache.updateCache(this.CACHE_KEYS.LIGHTNING_ACCOUNTS, ln_wallet);
				this.lightning_accounts_subject.next(ln_wallet);
			}),
			catchError((error) => {
				console.error('Error loading lightning wallet:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadLightningChannels(): Observable<LightningChannel[]> {
		if (this.lightning_channels_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.LIGHTNING_CHANNELS)) {
			return of(this.lightning_channels_subject.value);
		}

		const query = getApiQuery(LIGHTNING_CHANNELS_QUERY);

		return this.http.post<OrchardRes<LightningChannelsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_channels;
			}),
			map((ln_channels) => ln_channels.map((channel) => new LightningChannel(channel))),
			tap((ln_channels) => {
				this.cache.updateCache(this.CACHE_KEYS.LIGHTNING_CHANNELS, ln_channels);
				this.lightning_channels_subject.next(ln_channels);
			}),
			catchError((error) => {
				console.error('Error loading lightning channels:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadLightningClosedChannels(): Observable<LightningClosedChannel[]> {
		if (this.lightning_closed_channels_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.LIGHTNING_CLOSED_CHANNELS)) {
			return of(this.lightning_closed_channels_subject.value);
		}

		const query = getApiQuery(LIGHTNING_CLOSED_CHANNELS_QUERY);

		return this.http.post<OrchardRes<LightningClosedChannelsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_closed_channels;
			}),
			map((ln_closed_channels) => ln_closed_channels.map((channel) => new LightningClosedChannel(channel))),
			tap((ln_closed_channels) => {
				this.cache.updateCache(this.CACHE_KEYS.LIGHTNING_CLOSED_CHANNELS, ln_closed_channels);
				this.lightning_closed_channels_subject.next(ln_closed_channels);
			}),
			catchError((error) => {
				console.error('Error loading lightning closed channels:', error);
				return throwError(() => error);
			}),
		);
	}

	public getLightningRequest(request: string): Observable<LightningRequest> {
		const query = getApiQuery(LIGHTNING_REQUEST_QUERY, {request});

		return this.http.post<OrchardRes<LightningRequestResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_request;
			}),
			map((ln_request) => new LightningRequest(ln_request)),
			catchError((error) => {
				console.error('Error loading lightning request:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadLightningAnalytics(args: LightningAnalyticsArgs): Observable<LightningAnalytic[]> {
		if (args.interval === LightningAnalyticsInterval.Custom) {
			return this.loadGenericLightningAnalytics(
				args,
				this.lightning_analytics_pre_subject.value,
				this.CACHE_KEYS.LIGHTNING_ANALYTICS_PRE,
			);
		}
		return this.loadGenericLightningAnalytics(args, this.lightning_analytics_subject.value, this.CACHE_KEYS.LIGHTNING_ANALYTICS);
	}

	public loadLightningAnalyticsBackfillStatus(): Observable<LightningAnalyticsBackfillStatus> {
		const query = getApiQuery(LIGHTNING_ANALYTICS_BACKFILL_STATUS_QUERY);

		return this.http.post<OrchardRes<LightningAnalyticsBackfillStatusResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_analytics_backfill_status;
			}),
			map((status) => new LightningAnalyticsBackfillStatus(status)),
			catchError((error) => {
				console.error('Error loading lightning analytics backfill status:', error);
				return throwError(() => error);
			}),
		);
	}

	private loadGenericLightningAnalytics(
		args: LightningAnalyticsArgs,
		subject_value: LightningAnalytic[] | null,
		cache_key: string,
	): Observable<LightningAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(LIGHTNING_ANALYTICS_QUERY, args);

		return this.http.post<OrchardRes<LightningAnalyticsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.lightning_analytics;
			}),
			map((lightning_analytics) => lightning_analytics.map((la) => new LightningAnalytic(la))),
			tap((lightning_analytics) => {
				this.cache.updateCache(cache_key, lightning_analytics);
			}),
			catchError((error) => {
				console.error('Error loading lightning analytics:', error);
				return throwError(() => error);
			}),
		);
	}
}
