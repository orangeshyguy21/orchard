/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {BehaviorSubject, catchError, map, Observable, of, shareReplay, switchMap, tap, throwError} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {
	MintInfoResponse,
	MintQuoteTtlsResponse,
	MintBalancesResponse,
	MintKeysetsResponse,
	MintMintQuotesResponse,
	MintMeltQuotesResponse,
	MintAnalyticsArgs,
	MintMintQuotesArgs,
	MintMeltQuotesArgs,
	MintProofGroupsArgs,
	MintPromiseGroupsArgs,
	MintSwapsArgs,
	MintKeysetCountsArgs,
	MintAnalyticsBalancesResponse,
	MintAnalyticsMintsResponse,
	MintAnalyticsMeltsResponse,
	MintAnalyticsSwapsResponse,
	MintAnalyticsFeesResponse,
	MintAnalyticsKeysetsResponse,
	MintKeysetCountsResponse,
	MintInfoRpcResponse,
	MintNameUpdateResponse,
	MintDescriptionUpdateResponse,
	MintDescriptionLongUpdateResponse,
	MintIconUrlUpdateResponse,
	MintMotdUpdateResponse,
	MintUrlUpdateResponse,
	MintUrlAddResponse,
	MintUrlRemoveResponse,
	MintContactUpdateResponse,
	MintContactRemoveResponse,
	MintContactAddResponse,
	MintQuoteTtlUpdateResponse,
	MintNut04UpdateResponse,
	MintNut05UpdateResponse,
	MintNut04QuoteUpdateResponse,
	MintNut05QuoteUpdateResponse,
	MintKeysetRotationResponse,
	MintMintQuotesDataResponse,
	MintMeltQuotesDataResponse,
	MintProofGroupsDataResponse,
	MintPromiseGroupsDataResponse,
	MintSwapsDataResponse,
	MintDatabaseInfoResponse,
	MintDatabaseBackupResponse,
	MintDatabaseRestoreResponse,
	MintProofGroupStatsResponse,
	MintFeesResponse,
} from '@client/modules/mint/types/mint.types';
import {ApiService} from '@client/modules/api/services/api/api.service';
import {CacheService} from '@client/modules/cache/services/cache/cache.service';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintQuoteTtls} from '@client/modules/mint/classes/mint-quote-ttls.class';
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {MintProofGroup} from '@client/modules/mint/classes/mint-proof-group.class';
import {MintPromiseGroup} from '@client/modules/mint/classes/mint-promise-group.class';
import {MintAnalytic, MintAnalyticKeyset} from '@client/modules/mint/classes/mint-analytic.class';
import {MintSwap} from '@client/modules/mint/classes/mint-swap.class';
import {MintFee} from '@client/modules/mint/classes/mint-fee.class';
import {MintKeysetCount} from '@client/modules/mint/classes/mint-keyset-count.class';
import {MintDatabaseInfo} from '@client/modules/mint/classes/mint-database-info.class';
/* Shared Dependencies */
import {MintAnalyticsInterval, OrchardContact, MintUnit} from '@shared/generated.types';
/* Local Dependencies */
import {
	MINT_INFO_QUERY,
	MINT_INFO_RPC_QUERY,
	MINT_QUOTE_TTLS_QUERY,
	MINT_BALANCES_QUERY,
	MINT_KEYSETS_QUERY,
	MINT_ANALYTICS_BALANCES_QUERY,
	MINT_ANALYTICS_MINTS_QUERY,
	MINT_ANALYTICS_MELTS_QUERY,
	MINT_ANALYTICS_SWAPS_QUERY,
	MINT_ANALYTICS_FEES_QUERY,
	MINT_MINT_QUOTES_QUERY,
	MINT_MELT_QUOTES_QUERY,
	MINT_ANALYTICS_KEYSETS_QUERY,
	MINT_KEYSET_COUNTS_QUERY,
	MINT_MINT_QUOTES_DATA_QUERY,
	MINT_MELT_QUOTES_DATA_QUERY,
	MINT_PROOF_GROUPS_DATA_QUERY,
	MINT_PROMISE_GROUPS_DATA_QUERY,
	MINT_SWAPS_DATA_QUERY,
	MINT_NAME_MUTATION,
	MINT_DESCRIPTION_MUTATION,
	MINT_DESCRIPTION_LONG_MUTATION,
	MINT_ICON_MUTATION,
	MINT_MOTD_MUTATION,
	MINT_URL_UPDATE_MUTATIONS,
	MINT_URL_ADD_MUTATION,
	MINT_URL_REMOVE_MUTATION,
	MINT_CONTACT_REMOVE_MUTATION,
	MINT_CONTACT_ADD_MUTATION,
	MINT_QUOTE_TTL_MUTATION,
	MINT_NUT04_UPDATE_MUTATION,
	MINT_NUT05_UPDATE_MUTATION,
	MINT_NUT04_QUOTE_UPDATE_MUTATION,
	MINT_NUT05_QUOTE_UPDATE_MUTATION,
	MINT_KEYSETS_ROTATION_MUTATION,
	MINT_DATABASE_INFO_QUERY,
	MINT_DATABASE_BACKUP_MUTATION,
	MINT_DATABASE_RESTORE_MUTATION,
	MINT_PROOF_GROUP_STATS_QUERY,
	MINT_FEES_QUERY,
} from './mint.queries';

@Injectable({
	providedIn: 'root',
})
export class MintService {
	public get mint_info$(): Observable<MintInfo | null> {
		return this.mint_info_subject.asObservable();
	}

	public readonly CACHE_KEYS = {
		MINT_INFO: 'mint-info',
		MINT_BALANCES: 'mint-balances',
		MINT_KEYSETS: 'mint-keysets',
		MINT_ANALYTICS_BALANCES: 'mint-analytics-balances',
		MINT_ANALYTICS_PRE_BALANCES: 'mint-analytics-pre-balances',
		MINT_ANALYTICS_MINTS: 'mint-analytics-mints',
		MINT_ANALYTICS_PRE_MINTS: 'mint-analytics-pre-mints',
		MINT_ANALYTICS_MELTS: 'mint-analytics-melts',
		MINT_ANALYTICS_PRE_MELTS: 'mint-analytics-pre-melts',
		MINT_ANALYTICS_SWAPS: 'mint-analytics-swaps',
		MINT_ANALYTICS_PRE_SWAPS: 'mint-analytics-pre-swaps',
		MINT_ANALYTICS_FEES: 'mint-analytics-fees',
		MINT_ANALYTICS_PRE_FEES: 'mint-analytics-pre-fees',
		MINT_ANALYTICS_KEYSETS: 'mint-analytics-keysets',
		MINT_ANALYTICS_PRE_KEYSETS: 'mint-analytics-pre-keysets',
		MINT_KEYSET_COUNTS: 'mint-keyset-counts',
		MINT_MINT_QUOTES: 'mint-mint-quotes',
		MINT_MELT_QUOTES: 'mint-melt-quotes',
		MINT_FEES: 'mint-fees',
		MINT_DATABASE_INFO: 'mint-database-info',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.MINT_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.MINT_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_KEYSETS]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_MINTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_MELTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_SWAPS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_SWAPS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_FEES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_FEES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_KEYSET_COUNTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_MINT_QUOTES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_MELT_QUOTES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_FEES]: 60 * 60 * 1000, // 60 minutes
		[this.CACHE_KEYS.MINT_DATABASE_INFO]: 60 * 60 * 1000, // 60 minutes
	};

	/* Subjects for caching */
	private readonly mint_info_subject: BehaviorSubject<MintInfo | null>;
	private readonly mint_balances_subject: BehaviorSubject<MintBalance[] | null>;
	private readonly mint_keysets_subject: BehaviorSubject<MintKeyset[] | null>;
	private readonly mint_analytics_balances_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_balances_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_mints_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_mints_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_melts_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_melts_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_swaps_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_swaps_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_fees_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_fees_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_keysets_subject: BehaviorSubject<MintAnalyticKeyset[] | null>;
	private readonly mint_analytics_pre_keysets_subject: BehaviorSubject<MintAnalyticKeyset[] | null>;
	private readonly mint_keyset_counts_subject: BehaviorSubject<MintKeysetCount[] | null>;
	private readonly mint_mint_quotes_subject: BehaviorSubject<MintMintQuote[] | null>;
	private readonly mint_melt_quotes_subject: BehaviorSubject<MintMeltQuote[] | null>;
	private readonly mint_fees_subject: BehaviorSubject<MintFee[] | null>;
	private readonly mint_database_info_subject: BehaviorSubject<MintDatabaseInfo | null>;

	/* Observables for caching (rapid request caching) */
	private mint_info_observable!: Observable<MintInfo> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
		private apiService: ApiService,
	) {
		this.mint_info_subject = this.cache.createCache<MintInfo>(
			this.CACHE_KEYS.MINT_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_INFO],
		);
		this.mint_balances_subject = this.cache.createCache<MintBalance[]>(
			this.CACHE_KEYS.MINT_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_BALANCES],
		);
		this.mint_keysets_subject = this.cache.createCache<MintKeyset[]>(
			this.CACHE_KEYS.MINT_KEYSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_KEYSETS],
		);
		this.mint_analytics_balances_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_BALANCES],
		);
		this.mint_analytics_pre_balances_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES],
		);
		this.mint_analytics_mints_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_MINTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_MINTS],
		);
		this.mint_analytics_pre_mints_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS],
		);
		this.mint_analytics_melts_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_MELTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_MELTS],
		);
		this.mint_analytics_pre_melts_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS],
		);
		this.mint_analytics_swaps_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_SWAPS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_SWAPS],
		);
		this.mint_analytics_pre_swaps_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_SWAPS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_SWAPS],
		);
		this.mint_analytics_fees_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_FEES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_FEES],
		);
		this.mint_analytics_pre_fees_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_FEES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_FEES],
		);
		this.mint_analytics_keysets_subject = this.cache.createCache<MintAnalyticKeyset[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS],
		);
		this.mint_analytics_pre_keysets_subject = this.cache.createCache<MintAnalyticKeyset[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS],
		);
		this.mint_keyset_counts_subject = this.cache.createCache<MintKeysetCount[]>(
			this.CACHE_KEYS.MINT_KEYSET_COUNTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_KEYSET_COUNTS],
		);
		this.mint_mint_quotes_subject = this.cache.createCache<MintMintQuote[]>(
			this.CACHE_KEYS.MINT_MINT_QUOTES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_MINT_QUOTES],
		);
		this.mint_melt_quotes_subject = this.cache.createCache<MintMeltQuote[]>(
			this.CACHE_KEYS.MINT_MELT_QUOTES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_MELT_QUOTES],
		);
		this.mint_fees_subject = this.cache.createCache<MintFee[]>(
			this.CACHE_KEYS.MINT_FEES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_FEES],
		);
		this.mint_database_info_subject = this.cache.createCache<MintDatabaseInfo>(
			this.CACHE_KEYS.MINT_DATABASE_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_DATABASE_INFO],
		);
	}

	public clearInfoCache() {
		this.cache.clearCache(this.CACHE_KEYS.MINT_INFO);
	}

	public clearDasbhoardCache() {
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_BALANCES);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_MINTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_MELTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_SWAPS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_SWAPS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_FEES);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_FEES);
	}

	public clearKeysetsCache() {
		this.cache.clearCache(this.CACHE_KEYS.MINT_KEYSETS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_KEYSET_COUNTS);
	}

	public loadMintInfo(): Observable<MintInfo> {
		if (this.mint_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_INFO)) return of(this.mint_info_subject.value);
		if (this.mint_info_observable) return this.mint_info_observable;

		const query = getApiQuery(MINT_INFO_QUERY);

		this.mint_info_observable = this.http.post<OrchardRes<MintInfoResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_info;
			}),
			map((mintInfo) => new MintInfo(mintInfo)),
			tap((mintInfo) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_INFO, mintInfo);
				this.mint_info_subject.next(mintInfo);
				this.mint_info_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				console.error('Error loading mint info (public):', error);
				this.mint_info_observable = null;
				return throwError(() => error);
			}),
		);

		return this.mint_info_observable;
	}

	public getMintInfo(): Observable<MintInfoRpc> {
		const query = getApiQuery(MINT_INFO_RPC_QUERY);

		return this.http.post<OrchardRes<MintInfoRpcResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_info_rpc;
			}),
			map((mintInfoRpc) => new MintInfoRpc(mintInfoRpc)),
			catchError((error) => {
				console.error('Error loading mint info (rpc):', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintQuoteTtls(): Observable<MintQuoteTtls> {
		const query = getApiQuery(MINT_QUOTE_TTLS_QUERY);

		return this.http.post<OrchardRes<MintQuoteTtlsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_quote_ttl;
			}),
			map((mintQuoteTtls) => new MintQuoteTtls(mintQuoteTtls)),
			catchError((error) => {
				console.error('Error loading mint quote ttls:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintKeysetBalance(keyset_id: string): Observable<MintBalance> {
		const query = getApiQuery(MINT_BALANCES_QUERY, {keyset_id});

		return this.http.post<OrchardRes<MintBalancesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_balances;
			}),
			map((mint_balances) => new MintBalance(mint_balances[0])),
			catchError((error) => {
				console.error('Error loading mint keyset balance:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintBalances(): Observable<MintBalance[]> {
		if (this.mint_balances_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_BALANCES)) {
			return of(this.mint_balances_subject.value);
		}

		const query = getApiQuery(MINT_BALANCES_QUERY);

		return this.http.post<OrchardRes<MintBalancesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_balances;
			}),
			map((mint_balances) => mint_balances.map((mint_balance) => new MintBalance(mint_balance))),
			tap((mint_balances) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_BALANCES, mint_balances);
			}),
			catchError((error) => {
				console.error('Error loading mint balances:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintKeysets(): Observable<MintKeyset[]> {
		if (this.mint_keysets_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_KEYSETS)) {
			return of(this.mint_keysets_subject.value);
		}

		const query = getApiQuery(MINT_KEYSETS_QUERY);

		return this.http.post<OrchardRes<MintKeysetsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_keysets;
			}),
			map((mint_keysets) => mint_keysets.map((mint_keyset) => new MintKeyset(mint_keyset))),
			tap((mint_keysets) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_KEYSETS, mint_keysets);
			}),
			catchError((error) => {
				console.error('Error loading mint keysets:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintAnalyticsBalances(args: MintAnalyticsArgs) {
		if (args.interval === MintAnalyticsInterval.Custom) {
			return this.loadGenericMintAnalyticsBalances(
				args,
				this.mint_analytics_pre_balances_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES,
			);
		} else {
			return this.loadGenericMintAnalyticsBalances(
				args,
				this.mint_analytics_balances_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_BALANCES,
			);
		}
	}

	private loadGenericMintAnalyticsBalances(
		args: MintAnalyticsArgs,
		subject_value: MintAnalytic[] | null,
		cache_key: string,
	): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_BALANCES_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsBalancesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_balances;
			}),
			map((mint_analytics_balances) => mint_analytics_balances.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_balances) => {
				this.cache.updateCache(cache_key, mint_analytics_balances);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics balances:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintAnalyticsMints(args: MintAnalyticsArgs) {
		if (args.interval === MintAnalyticsInterval.Custom) {
			return this.loadGenericMintAnalyticsMints(
				args,
				this.mint_analytics_pre_mints_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS,
			);
		} else {
			return this.loadGenericMintAnalyticsMints(args, this.mint_analytics_mints_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_MINTS);
		}
	}

	private loadGenericMintAnalyticsMints(
		args: MintAnalyticsArgs,
		subject_value: MintAnalytic[] | null,
		cache_key: string,
	): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_MINTS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsMintsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_mints;
			}),
			map((mint_analytics_mints) => mint_analytics_mints.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_mints) => {
				this.cache.updateCache(cache_key, mint_analytics_mints);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics mints:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintAnalyticsMelts(args: MintAnalyticsArgs) {
		if (args.interval === MintAnalyticsInterval.Custom) {
			return this.loadGenericMintAnalyticsMelts(
				args,
				this.mint_analytics_pre_melts_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS,
			);
		} else {
			return this.loadGenericMintAnalyticsMelts(args, this.mint_analytics_melts_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_MELTS);
		}
	}

	private loadGenericMintAnalyticsMelts(
		args: MintAnalyticsArgs,
		subject_value: MintAnalytic[] | null,
		cache_key: string,
	): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_MELTS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsMeltsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_melts;
			}),
			map((mint_analytics_melts) => mint_analytics_melts.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_melts) => {
				this.cache.updateCache(cache_key, mint_analytics_melts);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics melts:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintAnalyticsSwaps(args: MintAnalyticsArgs) {
		if (args.interval === MintAnalyticsInterval.Custom) {
			return this.loadGenericMintAnalyticsSwaps(
				args,
				this.mint_analytics_pre_swaps_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_PRE_SWAPS,
			);
		} else {
			return this.loadGenericMintAnalyticsSwaps(args, this.mint_analytics_swaps_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_SWAPS);
		}
	}

	private loadGenericMintAnalyticsSwaps(
		args: MintAnalyticsArgs,
		subject_value: MintAnalytic[] | null,
		cache_key: string,
	): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_SWAPS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsSwapsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_swaps;
			}),
			map((mint_analytics_swaps) => mint_analytics_swaps.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_swaps) => {
				this.cache.updateCache(cache_key, mint_analytics_swaps);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics swaps:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintAnalyticsFees(args: MintAnalyticsArgs) {
		if (args.interval === MintAnalyticsInterval.Custom) {
			return this.loadGenericMintAnalyticsFees(
				args,
				this.mint_analytics_pre_fees_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_PRE_FEES,
			);
		} else {
			return this.loadGenericMintAnalyticsFees(args, this.mint_analytics_fees_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_FEES);
		}
	}

	private loadGenericMintAnalyticsFees(
		args: MintAnalyticsArgs,
		subject_value: MintAnalytic[] | null,
		cache_key: string,
	): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_FEES_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsFeesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_fees;
			}),
			map((mint_analytics_fees) => mint_analytics_fees.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_fees) => {
				this.cache.updateCache(cache_key, mint_analytics_fees);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics fees:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintMintQuotes(args?: MintMintQuotesArgs) {
		if (this.mint_mint_quotes_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_MINT_QUOTES)) {
			return of(this.mint_mint_quotes_subject.value);
		}

		const query = getApiQuery(MINT_MINT_QUOTES_QUERY, args);

		return this.http.post<OrchardRes<MintMintQuotesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_mint_quotes;
			}),
			map((mint_mint_quotes) => mint_mint_quotes.map((mint_mint_quote) => new MintMintQuote(mint_mint_quote))),
			tap((mint_mint_quotes) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_MINT_QUOTES, mint_mint_quotes);
			}),
			catchError((error) => {
				console.error('Error loading mint mint quotes:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintMeltQuotes(args?: MintMeltQuotesArgs) {
		if (this.mint_melt_quotes_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_MELT_QUOTES)) {
			return of(this.mint_melt_quotes_subject.value);
		}

		const query = getApiQuery(MINT_MELT_QUOTES_QUERY, args);

		return this.http.post<OrchardRes<MintMeltQuotesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_melt_quotes;
			}),
			map((mint_melt_quotes) => mint_melt_quotes.map((mint_melt_quote) => new MintMeltQuote(mint_melt_quote))),
			tap((mint_melt_quotes) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_MELT_QUOTES, mint_melt_quotes);
			}),
			catchError((error) => {
				console.error('Error loading mint melt quotes:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintAnalyticsKeysets(args: MintAnalyticsArgs) {
		if (args.interval === MintAnalyticsInterval.Custom) {
			return this.loadGenericMintAnalyticsKeysets(
				args,
				this.mint_analytics_pre_keysets_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS,
			);
		} else {
			return this.loadGenericMintAnalyticsKeysets(
				args,
				this.mint_analytics_keysets_subject.value,
				this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS,
			);
		}
	}

	private loadGenericMintAnalyticsKeysets(
		args: MintAnalyticsArgs,
		subject_value: MintAnalyticKeyset[] | null,
		cache_key: string,
	): Observable<MintAnalyticKeyset[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_KEYSETS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsKeysetsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_keysets;
			}),
			map((mint_analytics_keysets) => mint_analytics_keysets.map((mint_analytic) => new MintAnalyticKeyset(mint_analytic))),
			tap((mint_analytics_keysets) => {
				this.cache.updateCache(cache_key, mint_analytics_keysets);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics keysets:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintKeysetCounts(args: MintKeysetCountsArgs) {
		if (this.mint_keyset_counts_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_KEYSET_COUNTS)) {
			return of(this.mint_keyset_counts_subject.value);
		}

		const query = getApiQuery(MINT_KEYSET_COUNTS_QUERY, args);

		return this.http.post<OrchardRes<MintKeysetCountsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_keyset_counts;
			}),
			map((mint_keyset_counts) =>
				mint_keyset_counts.map((mint_keyset_count) => new MintKeysetCount(mint_keyset_count)),
			),
			tap((mint_keyset_counts) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_KEYSET_COUNTS, mint_keyset_counts);
			}),
			catchError((error) => {
				console.error('Error loading mint keyset proof counts:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintMintQuotesData(args: MintMintQuotesArgs) {
		const query = getApiQuery(MINT_MINT_QUOTES_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintMintQuotesDataResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_mint_quotes_data) => {
				return {
					mint_mint_quotes: mint_mint_quotes_data.mint_mint_quotes.map((mint_mint_quote) => new MintMintQuote(mint_mint_quote)),
					count: mint_mint_quotes_data.mint_count_mint_quotes.count,
				};
			}),
			catchError((error) => {
				console.error('Error loading mint mint quotes data:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintMeltQuotesData(args: MintMeltQuotesArgs) {
		const query = getApiQuery(MINT_MELT_QUOTES_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintMeltQuotesDataResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_melt_quotes_data) => {
				return {
					mint_melt_quotes: mint_melt_quotes_data.mint_melt_quotes.map((mint_melt_quote) => new MintMeltQuote(mint_melt_quote)),
					count: mint_melt_quotes_data.mint_count_melt_quotes.count,
				};
			}),
			catchError((error) => {
				console.error('Error loading mint melt quotes data:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintProofGroupsData(args: MintProofGroupsArgs) {
		const query = getApiQuery(MINT_PROOF_GROUPS_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintProofGroupsDataResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_proof_groups_data) => {
				return {
					mint_proof_groups: mint_proof_groups_data.mint_proof_groups.map(
						(mint_proof_group) => new MintProofGroup(mint_proof_group),
					),
					count: mint_proof_groups_data.mint_count_proof_groups.count,
				};
			}),
			catchError((error) => {
				console.error('Error loading mint proof groups data:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintPromiseGroupsData(args: MintPromiseGroupsArgs) {
		const query = getApiQuery(MINT_PROMISE_GROUPS_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintPromiseGroupsDataResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_promise_groups_data) => {
				return {
					mint_promise_groups: mint_promise_groups_data.mint_promise_groups.map(
						(mint_promise_group) => new MintPromiseGroup(mint_promise_group),
					),
					count: mint_promise_groups_data.mint_count_promise_groups.count,
				};
			}),
			catchError((error) => {
				console.error('Error loading mint promise groups data:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintSwapsData(args: MintSwapsArgs) {
		const query = getApiQuery(MINT_SWAPS_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintSwapsDataResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_swaps_data) => {
				return {
					mint_swaps: mint_swaps_data.mint_swaps.map((swap) => new MintSwap(swap)),
					count: mint_swaps_data.mint_count_swaps.count,
				};
			}),
			catchError((error) => {
				console.error('Error loading mint swaps data:', error);
				return throwError(() => error);
			}),
		);
	}

	public getMintProofGroupStats(unit: MintUnit) {
		const query = getApiQuery(MINT_PROOF_GROUP_STATS_QUERY, {unit});

		return this.http.post<OrchardRes<MintProofGroupStatsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error loading mint proof group stats:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintFees(limit: number): Observable<MintFee[]> {
		if (this.mint_fees_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_FEES)) {
			return of(this.mint_fees_subject.value);
		}

		const query = getApiQuery(MINT_FEES_QUERY, {limit});

		return this.http.post<OrchardRes<MintFeesResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_fees;
			}),
			map((mint_fees) => mint_fees.map((mint_fee) => new MintFee(mint_fee))),
			tap((mint_fees) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_FEES, mint_fees);
				this.mint_fees_subject.next(mint_fees);
			}),
			catchError((error) => {
				console.error('Error loading mint fees:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintName(name: string): Observable<MintNameUpdateResponse> {
		const query = getApiQuery(MINT_NAME_MUTATION, {name});

		return this.http.post<OrchardRes<MintNameUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint name:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintDescription(description: string): Observable<MintDescriptionUpdateResponse> {
		const query = getApiQuery(MINT_DESCRIPTION_MUTATION, {description});

		return this.http.post<OrchardRes<MintDescriptionUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint description:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintDescriptionLong(description: string): Observable<MintDescriptionLongUpdateResponse> {
		const query = getApiQuery(MINT_DESCRIPTION_LONG_MUTATION, {description});

		return this.http.post<OrchardRes<MintDescriptionLongUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint long description:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintIcon(icon_url: string): Observable<MintIconUrlUpdateResponse> {
		const query = getApiQuery(MINT_ICON_MUTATION, {icon_url});

		return this.http.post<OrchardRes<MintIconUrlUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint icon:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintMotd(motd: string): Observable<MintMotdUpdateResponse> {
		const query = getApiQuery(MINT_MOTD_MUTATION, {motd});

		return this.http.post<OrchardRes<MintMotdUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint motd:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintUrl(url_add: string, url_remove: string): Observable<MintUrlUpdateResponse> {
		const query = getApiQuery(MINT_URL_UPDATE_MUTATIONS, {url_add, url_remove});

		return this.http.post<OrchardRes<MintUrlUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint url:', error);
				return throwError(() => error);
			}),
		);
	}

	public addMintUrl(url: string): Observable<MintUrlAddResponse> {
		const query = getApiQuery(MINT_URL_ADD_MUTATION, {url});

		return this.http.post<OrchardRes<MintUrlAddResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error adding mint url:', error);
				return throwError(() => error);
			}),
		);
	}

	public removeMintUrl(url: string): Observable<MintUrlRemoveResponse> {
		const query = getApiQuery(MINT_URL_REMOVE_MUTATION, {url});

		return this.http.post<OrchardRes<MintUrlRemoveResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error removing mint url:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintContact(contact_add: OrchardContact, contact_remove: OrchardContact): Observable<MintContactUpdateResponse> {
		return this.removeMintContact(contact_remove).pipe(
			switchMap((remove_response) => {
				return this.addMintContact(contact_add).pipe(
					map((add_response) => ({
						mint_contact_remove: remove_response.mint_contact_remove,
						mint_contact_add: add_response.mint_contact_add,
					})),
				);
			}),
			catchError((error) => {
				console.error('Error updating mint contact:', error);
				return throwError(() => error);
			}),
		);
	}

	public removeMintContact(contact: OrchardContact): Observable<MintContactRemoveResponse> {
		const query = getApiQuery(MINT_CONTACT_REMOVE_MUTATION, {method: contact.method, info: contact.info});

		return this.http.post<OrchardRes<MintContactRemoveResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error removing mint contact:', error);
				return throwError(() => error);
			}),
		);
	}

	public addMintContact(contact: OrchardContact): Observable<MintContactAddResponse> {
		const query = getApiQuery(MINT_CONTACT_ADD_MUTATION, {method: contact.method, info: contact.info});

		return this.http.post<OrchardRes<MintContactAddResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error adding mint contact:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintQuoteTtl(key: keyof MintQuoteTtls, value: number | null): Observable<MintQuoteTtlUpdateResponse> {
		const query = getApiQuery(MINT_QUOTE_TTL_MUTATION, {mint_quote_ttl_update: {[key]: value}});

		return this.http.post<OrchardRes<MintQuoteTtlUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint quote ttl:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintNut04(unit: string, method: string, key: string, value: any): Observable<MintNut04UpdateResponse> {
		const query = getApiQuery(MINT_NUT04_UPDATE_MUTATION, {unit, method, [key]: value});

		return this.http.post<OrchardRes<MintNut04UpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint nut04:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintNut05(unit: string, method: string, key: string, value: any): Observable<MintNut05UpdateResponse> {
		const query = getApiQuery(MINT_NUT05_UPDATE_MUTATION, {unit, method, [key]: value});

		return this.http.post<OrchardRes<MintNut05UpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint nut05:', error);
				return throwError(() => error);
			}),
		);
	}

	public rotateMintKeysets(
		unit: string,
		input_fee_ppk: number,
		amounts: number[],
		keyset_v2: boolean,
	): Observable<MintKeysetRotationResponse> {
		const query = getApiQuery(MINT_KEYSETS_ROTATION_MUTATION, {unit, input_fee_ppk, amounts, keyset_v2});

		return this.http.post<OrchardRes<MintKeysetRotationResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error rotating mint keysets:', error);
				return throwError(() => error);
			}),
		);
	}

	public loadMintDatabaseInfo(): Observable<MintDatabaseInfo> {
		if (this.mint_database_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_DATABASE_INFO)) {
			return of(this.mint_database_info_subject.value);
		}

		const query = getApiQuery(MINT_DATABASE_INFO_QUERY);

		return this.http.post<OrchardRes<MintDatabaseInfoResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_database_info;
			}),
			map((info) => new MintDatabaseInfo(info)),
			tap((info) => {
				this.cache.updateCache(this.CACHE_KEYS.MINT_DATABASE_INFO, info);
			}),
			catchError((error) => {
				console.error('Error loading mint database info:', error);
				return throwError(() => error);
			}),
		);
	}

	public createMintDatabaseBackup(): Observable<MintDatabaseBackupResponse> {
		const query = getApiQuery(MINT_DATABASE_BACKUP_MUTATION, {});

		return this.http.post<OrchardRes<MintDatabaseBackupResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error creating mint database backup:', error);
				return throwError(() => error);
			}),
		);
	}

	public restoreMintDatabaseBackup(filebase64: string): Observable<MintDatabaseRestoreResponse> {
		const query = getApiQuery(MINT_DATABASE_RESTORE_MUTATION, {filebase64});

		return this.http.post<OrchardRes<MintDatabaseRestoreResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error restoring mint database backup:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMint(mutation: string, variables: Record<string, any>) {
		const query = getApiQuery(mutation, variables);

		return this.http.post<OrchardRes<any>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintNut04Quote(quote_id: string, state: string): Observable<MintNut04QuoteUpdateResponse> {
		const query = getApiQuery(MINT_NUT04_QUOTE_UPDATE_MUTATION, {quote_id, state});

		return this.http.post<OrchardRes<MintNut04QuoteUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint nut04 quote:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateMintNut05Quote(quote_id: string, state: string): Observable<MintNut05QuoteUpdateResponse> {
		const query = getApiQuery(MINT_NUT05_QUOTE_UPDATE_MUTATION, {quote_id, state});

		return this.http.post<OrchardRes<MintNut05QuoteUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint nut05 quote:', error);
				return throwError(() => error);
			}),
		);
	}
}
