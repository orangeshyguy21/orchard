/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError} from 'rxjs';
/* Application Dependencies */
import {api, getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {CacheService} from '@client/modules/cache/services/cache/cache.service';
/* Native Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningAccount} from '@client/modules/lightning/classes/lightning-account.class';
import {LightningRequest} from '@client/modules/lightning/classes/lightning-request.class';
import {
	LightningInfoResponse,
	LightningBalanceResponse,
	LightningWalletResponse,
	LightningRequestResponse,
} from '@client/modules/lightning/types/lightning.types';
/* Local Dependencies */
import {LIGHTNING_INFO_QUERY, LIGHTNING_BALANCE_QUERY, LIGHTNING_WALLET_QUERY, LIGHTNING_REQUEST_QUERY} from './lightning.queries';

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
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.LIGHTNING_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.LIGHTNING_BALANCE]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.LIGHTNING_ACCOUNTS]: 5 * 60 * 1000, // 5 minutes
	};

	/* Subjects for caching */
	private readonly lightning_info_subject: BehaviorSubject<LightningInfo | null>;
	private readonly lightning_balance_subject: BehaviorSubject<LightningBalance | null>;
	private readonly lightning_accounts_subject: BehaviorSubject<LightningAccount[] | null>;

	/* Observables for caching (rapid request caching) */
	private lightning_info_observable!: Observable<LightningInfo> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
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
	}

	public loadLightningInfo(): Observable<LightningInfo> {
		if (this.lightning_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.LIGHTNING_INFO))
			return of(this.lightning_info_subject.value);
		if (this.lightning_info_observable) return this.lightning_info_observable;

		const query = getApiQuery(LIGHTNING_INFO_QUERY);

		this.lightning_info_observable = this.http.post<OrchardRes<LightningInfoResponse>>(api, query).pipe(
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

		return this.http.post<OrchardRes<LightningBalanceResponse>>(api, query).pipe(
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

		return this.http.post<OrchardRes<LightningWalletResponse>>(api, query).pipe(
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

	public getLightningRequest(request: string): Observable<LightningRequest> {
		const query = getApiQuery(LIGHTNING_REQUEST_QUERY, {request});

		return this.http.post<OrchardRes<LightningRequestResponse>>(api, query).pipe(
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
}
