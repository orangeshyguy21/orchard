/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { GQLResponse } from '@client/modules/api/types/api.types';
import { MintInfoResponse, MintBalancesResponse, MintKeysetsResponse, MintPromisesResponse, MintPromisesArgs, MintAnalyticsArgs, MintAnalyticsBalancesResponse } from '@client/modules/mint/types/mint.types';
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintPromise } from '@client/modules/mint/classes/mint-promise.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
/* Local Dependencies */
import { MINT_INFO_QUERY, MINT_BALANCES_QUERY, MINT_KEYSETS_QUERY, MINT_PROMISES_QUERY, MINT_ANALYTICS_BALANCES_QUERY } from './mint.queries';


@Injectable({
  	providedIn: 'root'
})
export class MintService {

	public readonly CACHE_KEYS = {
		MINT_INFO: 'mint-info',
		MINT_BALANCES: 'mint-balances',
		MINT_KEYSETS: 'mint-keysets',
		MINT_PROMISES: 'mint-promises',
		MINT_ANALYTICS_BALANCES: 'mint-analytics-balances',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.MINT_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.MINT_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_KEYSETS]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.MINT_PROMISES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_BALANCES]: 5 * 60 * 1000, // 5 minutes
	};

	/* Subjects for caching */
	private readonly mint_info_subject: BehaviorSubject<MintInfo | null>;
	private readonly mint_balances_subject: BehaviorSubject<MintBalance[] | null>;
	private readonly mint_keysets_subject: BehaviorSubject<MintKeyset[] | null>;
	private readonly mint_promises_subject: BehaviorSubject<MintPromise[] | null>;
	private readonly mint_analytics_balances_subject: BehaviorSubject<MintAnalytic[] | null>;

	/* Observables for caching (rapid request caching) */
	private mint_info_observable!: Observable<MintInfo> | null;

	constructor(
		public http: HttpClient,
		public cache: CacheService,
	) {
		this.mint_info_subject = this.cache.createCache<MintInfo>(
			this.CACHE_KEYS.MINT_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_INFO]
		);
		this.mint_balances_subject = this.cache.createCache<MintBalance[]>(
			this.CACHE_KEYS.MINT_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_BALANCES]
		);
		this.mint_keysets_subject = this.cache.createCache<MintKeyset[]>(
			this.CACHE_KEYS.MINT_KEYSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_KEYSETS]
		);
		this.mint_promises_subject = this.cache.createCache<MintPromise[]>(
			this.CACHE_KEYS.MINT_PROMISES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_PROMISES]
		);
		this.mint_analytics_balances_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_BALANCES]
		);
	}

	public loadMintInfo(): Observable<MintInfo> {
		if ( this.mint_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_INFO) ) return of(this.mint_info_subject.value);
		if ( this.mint_info_observable ) return this.mint_info_observable;

		const query = getApiQuery(MINT_INFO_QUERY);
	
		this.mint_info_observable = this.http.post<GQLResponse<MintInfoResponse>>(api, query).pipe(
			map((response) => response.data.mint_info),
			map((mintInfo) => new MintInfo(mintInfo)),
			tap((mintInfo) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_INFO, mintInfo);
				this.mint_info_subject.next(mintInfo);
				this.mint_info_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				console.error('Error loading mint info:', error);
				this.mint_info_observable = null;
				return throwError(() => error);
			})
		);
		
		return this.mint_info_observable;
	}

	public loadMintBalances(): Observable<MintBalance[]> {
		if ( this.mint_balances_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_BALANCES) ) {
			return of(this.mint_balances_subject.value);
		}
		
		const query = getApiQuery(MINT_BALANCES_QUERY);

		return this.http.post<GQLResponse<MintBalancesResponse>>(api, query).pipe(
			map((response) => response.data.mint_balances),
			map((mint_balances) => mint_balances.map((mint_balance) => new MintBalance(mint_balance))),
			tap((mint_balances) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_BALANCES, mint_balances);
			}),
			catchError((error) => {
				console.error('Error loading mint balances:', error);
				return throwError(() => error);
			})
		);
	}

	public loadMintKeysets(): Observable<MintKeyset[]> {
		if ( this.mint_keysets_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_KEYSETS) ) {
			return of(this.mint_keysets_subject.value);
		}

		const query = getApiQuery(MINT_KEYSETS_QUERY);

		return this.http.post<GQLResponse<MintKeysetsResponse>>(api, query).pipe(
			map((response) => response.data.mint_keysets),
			map((mint_keysets) => mint_keysets.map((mint_keyset) => new MintKeyset(mint_keyset))),
			tap((mint_keysets) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_KEYSETS, mint_keysets);
			}),
			catchError((error) => {
				console.error('Error loading mint keysets:', error);
				return throwError(() => error);
			})
		);
	}


	public loadMintPromises(args:MintPromisesArgs): Observable<MintPromise[]> {
		if (this.mint_promises_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_PROMISES)) {
			return of(this.mint_promises_subject.value);
		}

		const query = getApiQuery(MINT_PROMISES_QUERY, args);

		return this.http.post<GQLResponse<MintPromisesResponse>>(api, query).pipe(
			map((response) => response.data.mint_promises),
			map((mint_promises) => mint_promises.map((mint_promise) => new MintPromise(mint_promise))),
			tap((mint_promises) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_PROMISES, mint_promises);
			}),
			catchError((error) => {
				console.error('Error loading mint promises:', error);
				return throwError(() => error);
			})
		);
	}

	public loadMintAnalyticsBalances(args:MintAnalyticsArgs): Observable<MintAnalytic[]> {
		if (this.mint_analytics_balances_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_ANALYTICS_BALANCES)) {
			return of(this.mint_analytics_balances_subject.value);
		}

		const query = getApiQuery(MINT_ANALYTICS_BALANCES_QUERY, args);

		return this.http.post<GQLResponse<MintAnalyticsBalancesResponse>>(api, query).pipe(
			map((response) => response.data.mint_analytics_balances),
			map((mint_analytics_balances) => mint_analytics_balances.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_balances) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_ANALYTICS_BALANCES, mint_analytics_balances);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics balances:', error);
				return throwError(() => error);
			})
		);
	}
}
