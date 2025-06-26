/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
import { OrchardRes } from '@client/modules/api/types/api.types';
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
	MintAnalyticsBalancesResponse,
	MintAnalyticsMintsResponse,
	MintAnalyticsMeltsResponse,
	MintAnalyticsTransfersResponse,
	MintAnalyticsKeysetsResponse,
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
	MintKeysetRotationResponse,
	MintMintQuotesDataResponse,
	MintMeltQuotesDataResponse,
	MintProofGroupsDataResponse,
	MintPromiseGroupsDataResponse,
	MintDatabaseBackupResponse,
	MintDatabaseRestoreResponse,
} from '@client/modules/mint/types/mint.types';
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintQuoteTtls } from '@client/modules/mint/classes/mint-quote-ttls.class';
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
import { MintProofGroup } from '@client/modules/mint/classes/mint-proof-group.class';
import { MintPromiseGroup } from '@client/modules/mint/classes/mint-promise-group.class';
import { MintAnalytic, MintAnalyticKeyset } from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import { MintAnalyticsInterval, OrchardContact } from '@shared/generated.types';
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
	MINT_ANALYTICS_TRANSFERS_QUERY,
	MINT_MINT_QUOTES_QUERY,
	MINT_MELT_QUOTES_QUERY,
	MINT_ANALYTICS_KEYSETS_QUERY,
	MINT_MINT_QUOTES_DATA_QUERY,
	MINT_MELT_QUOTES_DATA_QUERY,
	MINT_PROOF_GROUPS_DATA_QUERY,
	MINT_PROMISE_GROUPS_DATA_QUERY,
	MINT_NAME_MUTATION,
	MINT_DESCRIPTION_MUTATION,
	MINT_DESCRIPTION_LONG_MUTATION,
	MINT_ICON_MUTATION,
	MINT_MOTD_MUTATION,
	MINT_URL_UPDATE_MUTATIONS,
	MINT_URL_ADD_MUTATION,
	MINT_URL_REMOVE_MUTATION,
	MINT_CONTACT_UPDATE_MUTATIONS,
	MINT_CONTACT_REMOVE_MUTATION,
	MINT_CONTACT_ADD_MUTATION,
	MINT_QUOTE_TTL_MUTATION,
	MINT_NUT04_UPDATE_MUTATION,
	MINT_NUT05_UPDATE_MUTATION,
	MINT_KEYSETS_ROTATION_MUTATION,
	MINT_DATABASE_BACKUP_MUTATION,
	MINT_DATABASE_RESTORE_MUTATION,
} from './mint.queries';


@Injectable({
  	providedIn: 'root'
})
export class MintService {

	public get mint_info$(): Observable<MintInfo | null> { return this.mint_info_subject.asObservable(); }

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
		MINT_ANALYTICS_TRANSFERS: 'mint-analytics-transfers',
		MINT_ANALYTICS_PRE_TRANSFERS: 'mint-analytics-pre-transfers',
		MINT_MINT_QUOTES: 'mint-mint-quotes',
		MINT_MELT_QUOTES: 'mint-melt-quotes',
		MINT_ANALYTICS_KEYSETS: 'mint-analytics-keysets',
		MINT_ANALYTICS_PRE_KEYSETS: 'mint-analytics-pre-keysets',
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
		[this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_MINT_QUOTES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_MELT_QUOTES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS]: 5 * 60 * 1000, // 5 minutes
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
	private readonly mint_analytics_transfers_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_transfers_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_mint_quotes_subject: BehaviorSubject<MintMintQuote[] | null>;
	private readonly mint_melt_quotes_subject: BehaviorSubject<MintMeltQuote[] | null>;
	private readonly mint_analytics_keysets_subject: BehaviorSubject<MintAnalyticKeyset[] | null>;
	private readonly mint_analytics_pre_keysets_subject: BehaviorSubject<MintAnalyticKeyset[] | null>;

	/* Observables for caching (rapid request caching) */
	private mint_info_observable!: Observable<MintInfo> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
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
		this.mint_analytics_balances_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_BALANCES]
		);
		this.mint_analytics_pre_balances_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES]
		);
		this.mint_analytics_mints_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_MINTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_MINTS]
		);
		this.mint_analytics_pre_mints_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS]
		);
		this.mint_analytics_melts_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_MELTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_MELTS]
		);
		this.mint_analytics_pre_melts_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS]
		);
		this.mint_analytics_transfers_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS]
		);
		this.mint_analytics_pre_transfers_subject = this.cache.createCache<MintAnalytic[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS]
		);
		this.mint_mint_quotes_subject = this.cache.createCache<MintMintQuote[]>(
			this.CACHE_KEYS.MINT_MINT_QUOTES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_MINT_QUOTES]
		);
		this.mint_melt_quotes_subject = this.cache.createCache<MintMeltQuote[]>(
			this.CACHE_KEYS.MINT_MELT_QUOTES,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_MELT_QUOTES]
		);
		this.mint_analytics_keysets_subject = this.cache.createCache<MintAnalyticKeyset[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS]
		);
		this.mint_analytics_pre_keysets_subject = this.cache.createCache<MintAnalyticKeyset[]>(
			this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS,
			this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS]
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
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS);
	}

	public clearKeysetsCache() {
		this.cache.clearCache(this.CACHE_KEYS.MINT_KEYSETS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS);
	}

	public loadMintInfo(): Observable<MintInfo> {
		if ( this.mint_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_INFO) ) return of(this.mint_info_subject.value);
		if ( this.mint_info_observable ) return this.mint_info_observable;

		const query = getApiQuery(MINT_INFO_QUERY);
	
		this.mint_info_observable = this.http.post<OrchardRes<MintInfoResponse>>(api, query).pipe(
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

		return this.http.post<OrchardRes<MintInfoRpcResponse>>(api, query).pipe(
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

		return this.http.post<OrchardRes<MintQuoteTtlsResponse>>(api, query).pipe(
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

	public getMintKeysetBalance(keyset_id:string): Observable<MintBalance> {
		const query = getApiQuery(MINT_BALANCES_QUERY, { keyset_id });

		return this.http.post<OrchardRes<MintBalancesResponse>>(api, query).pipe(
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
		if ( this.mint_balances_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_BALANCES) ) {
			return of(this.mint_balances_subject.value);
		}
		
		const query = getApiQuery(MINT_BALANCES_QUERY);

		return this.http.post<OrchardRes<MintBalancesResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintKeysets(): Observable<MintKeyset[]> {
		if ( this.mint_keysets_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_KEYSETS) ) {
			return of(this.mint_keysets_subject.value);
		}

		const query = getApiQuery(MINT_KEYSETS_QUERY);

		return this.http.post<OrchardRes<MintKeysetsResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintAnalyticsBalances(args:MintAnalyticsArgs) {
		if( args.interval === MintAnalyticsInterval.Custom ) {
			return this.loadGenericMintAnalyticsBalances(args, this.mint_analytics_pre_balances_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES);
		}else{
			return this.loadGenericMintAnalyticsBalances(args, this.mint_analytics_balances_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_BALANCES);
		}
	}

	private loadGenericMintAnalyticsBalances(args:MintAnalyticsArgs, subject_value:MintAnalytic[] | null, cache_key:string): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_BALANCES_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsBalancesResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintAnalyticsMints(args:MintAnalyticsArgs) {
		if( args.interval === MintAnalyticsInterval.Custom ) {
			return this.loadGenericMintAnalyticsMints(args, this.mint_analytics_pre_mints_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS);
		}else{
			return this.loadGenericMintAnalyticsMints(args, this.mint_analytics_mints_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_MINTS);
		}
	}

	private loadGenericMintAnalyticsMints(args:MintAnalyticsArgs, subject_value:MintAnalytic[] | null, cache_key:string): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_MINTS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsMintsResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintAnalyticsMelts(args:MintAnalyticsArgs) {
		if( args.interval === MintAnalyticsInterval.Custom ) {
			return this.loadGenericMintAnalyticsMelts(args, this.mint_analytics_pre_melts_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS);
		}else{
			return this.loadGenericMintAnalyticsMelts(args, this.mint_analytics_melts_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_MELTS);
		}
	}

	private loadGenericMintAnalyticsMelts(args:MintAnalyticsArgs, subject_value:MintAnalytic[] | null, cache_key:string): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_MELTS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsMeltsResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintAnalyticsTransfers(args:MintAnalyticsArgs) {
		if( args.interval === MintAnalyticsInterval.Custom ) {
			return this.loadGenericMintAnalyticsTransfers(args, this.mint_analytics_pre_transfers_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS);
		}else{
			return this.loadGenericMintAnalyticsTransfers(args, this.mint_analytics_transfers_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS);
		}
	}

	private loadGenericMintAnalyticsTransfers(args:MintAnalyticsArgs, subject_value:MintAnalytic[] | null, cache_key:string): Observable<MintAnalytic[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_TRANSFERS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsTransfersResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_analytics_transfers;
			}),
			map((mint_analytics_transfers) => mint_analytics_transfers.map((mint_analytic) => new MintAnalytic(mint_analytic))),
			tap((mint_analytics_transfers) => {
				this.cache.updateCache(cache_key, mint_analytics_transfers);
			}),
			catchError((error) => {
				console.error('Error loading mint analytics transfers:', error);
				return throwError(() => error);
			})
		);
	}

	public loadMintMintQuotes(args?:MintMintQuotesArgs) {
		if (this.mint_mint_quotes_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_MINT_QUOTES)) {
			return of(this.mint_mint_quotes_subject.value);
		}

		const query = getApiQuery(MINT_MINT_QUOTES_QUERY, args);

		return this.http.post<OrchardRes<MintMintQuotesResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintMeltQuotes(args?:MintMeltQuotesArgs) {
		if (this.mint_melt_quotes_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_MELT_QUOTES)) {
			return of(this.mint_melt_quotes_subject.value);
		}

		const query = getApiQuery(MINT_MELT_QUOTES_QUERY, args);

		return this.http.post<OrchardRes<MintMeltQuotesResponse>>(api, query).pipe(
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
			})
		);
	}

	public loadMintAnalyticsKeysets(args:MintAnalyticsArgs) {
		if( args.interval === MintAnalyticsInterval.Custom ) {
			return this.loadGenericMintAnalyticsKeysets(args, this.mint_analytics_pre_keysets_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_PRE_KEYSETS);
		}else{
			return this.loadGenericMintAnalyticsKeysets(args, this.mint_analytics_keysets_subject.value, this.CACHE_KEYS.MINT_ANALYTICS_KEYSETS);
		}
	}

	private loadGenericMintAnalyticsKeysets(args:MintAnalyticsArgs, subject_value:MintAnalyticKeyset[] | null, cache_key:string): Observable<MintAnalyticKeyset[]> {
		if (subject_value && this.cache.isCacheValid(cache_key)) {
			return of(subject_value);
		}

		const query = getApiQuery(MINT_ANALYTICS_KEYSETS_QUERY, args);

		return this.http.post<OrchardRes<MintAnalyticsKeysetsResponse>>(api, query).pipe(
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
			})
		);
	}	

	public getMintMintQuotesData(args:MintMintQuotesArgs) {
		const query = getApiQuery(MINT_MINT_QUOTES_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintMintQuotesDataResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_mint_quotes_data) => {
				return {
					mint_mint_quotes: mint_mint_quotes_data.mint_mint_quotes.map((mint_mint_quote) => new MintMintQuote(mint_mint_quote)),
					count: mint_mint_quotes_data.mint_count_mint_quotes.count
				}
			}),
			catchError((error) => {
				console.error('Error loading mint mint quotes data:', error);
				return throwError(() => error);
			})
		);
	}

	public getMintMeltQuotesData(args:MintMeltQuotesArgs) {
		const query = getApiQuery(MINT_MELT_QUOTES_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintMeltQuotesDataResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_melt_quotes_data) => {
				return {
					mint_melt_quotes: mint_melt_quotes_data.mint_melt_quotes.map((mint_melt_quote) => new MintMeltQuote(mint_melt_quote)),
					count: mint_melt_quotes_data.mint_count_melt_quotes.count
				}
			}),
			catchError((error) => {
				console.error('Error loading mint melt quotes data:', error);
				return throwError(() => error);
			})
		);
	}

	public getMintProofGroupsData(args:MintProofGroupsArgs) {
		const query = getApiQuery(MINT_PROOF_GROUPS_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintProofGroupsDataResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_proof_groups_data) => {
				return {
					mint_proof_groups: mint_proof_groups_data.mint_proof_groups.map((mint_proof_group) => new MintProofGroup(mint_proof_group)),
					count: mint_proof_groups_data.mint_count_proof_groups.count
				}
			}),
			catchError((error) => {
				console.error('Error loading mint proof groups data:', error);
				return throwError(() => error);
			})
		);
	}

	public getMintPromiseGroupsData(args:MintPromiseGroupsArgs) {
		const query = getApiQuery(MINT_PROMISE_GROUPS_DATA_QUERY, args);

		return this.http.post<OrchardRes<MintPromiseGroupsDataResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((mint_promise_groups_data) => {
				return {
					mint_promise_groups: mint_promise_groups_data.mint_promise_groups.map((mint_promise_group) => new MintPromiseGroup(mint_promise_group)),
					count: mint_promise_groups_data.mint_count_promise_groups.count
				}
			}),
			catchError((error) => {	
				console.error('Error loading mint promise groups data:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintName(name:string) : Observable<MintNameUpdateResponse> {
		const query = getApiQuery(MINT_NAME_MUTATION,  { mint_name_update: { name } });

		return this.http.post<OrchardRes<MintNameUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint name:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintDescription(description:string) : Observable<MintDescriptionUpdateResponse> {
		const query = getApiQuery(MINT_DESCRIPTION_MUTATION,  { mint_desc_update: { description } });

		return this.http.post<OrchardRes<MintDescriptionUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint description:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintDescriptionLong(description:string) : Observable<MintDescriptionLongUpdateResponse> {
		const query = getApiQuery(MINT_DESCRIPTION_LONG_MUTATION,  { mint_desc_update: { description } });

		return this.http.post<OrchardRes<MintDescriptionLongUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint long description:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintIcon(icon_url:string) : Observable<MintIconUrlUpdateResponse> {
		const query = getApiQuery(MINT_ICON_MUTATION,  { mint_icon_update: { icon_url } });

		return this.http.post<OrchardRes<MintIconUrlUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint icon:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintMotd(motd:string) : Observable<MintMotdUpdateResponse> {
		const query = getApiQuery(MINT_MOTD_MUTATION,  { mint_motd_update: { motd } });

		return this.http.post<OrchardRes<MintMotdUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint motd:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintUrl(url_add:string, url_remove:string) : Observable<MintUrlUpdateResponse> {
		const query = getApiQuery(MINT_URL_UPDATE_MUTATIONS,  { url_add: { url: url_add }, url_remove: { url: url_remove } });

		return this.http.post<OrchardRes<MintUrlUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint url:', error);
				return throwError(() => error);
			})
		);
	}

	public addMintUrl(url:string) : Observable<MintUrlAddResponse> {
		const query = getApiQuery(MINT_URL_ADD_MUTATION,  { mint_url_update: { url } });

		return this.http.post<OrchardRes<MintUrlAddResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error adding mint url:', error);
				return throwError(() => error);
			})
		);
	}

	public removeMintUrl(url:string) : Observable<MintUrlRemoveResponse> {
		const query = getApiQuery(MINT_URL_REMOVE_MUTATION,  { mint_url_update: { url } });

		return this.http.post<OrchardRes<MintUrlRemoveResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error removing mint url:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintContact(contact_add:OrchardContact, contact_remove:OrchardContact) : Observable<MintContactUpdateResponse> {
		const query = getApiQuery(MINT_CONTACT_UPDATE_MUTATIONS,  { 
			contact_add: {
				'method': contact_add.method,
				'info': contact_add.info
			},
			contact_remove: {
				'method': contact_remove.method,
				'info': contact_remove.info
			}
		});

		return this.http.post<OrchardRes<MintContactUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint contact:', error);
				return throwError(() => error);
			})
		);
	}

	public removeMintContact(contact:OrchardContact) : Observable<MintContactRemoveResponse> {
		const query = getApiQuery(MINT_CONTACT_REMOVE_MUTATION,  { contact_remove: { method: contact.method, info: contact.info } });

		return this.http.post<OrchardRes<MintContactRemoveResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error removing mint contact:', error);
				return throwError(() => error);
			})
		);
	}

	public addMintContact(contact:OrchardContact) : Observable<MintContactAddResponse> {
		const query = getApiQuery(MINT_CONTACT_ADD_MUTATION,  { contact_add: { method: contact.method, info: contact.info } });

		return this.http.post<OrchardRes<MintContactAddResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error adding mint contact:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintQuoteTtl(key:keyof MintQuoteTtls, value:number|null) : Observable<MintQuoteTtlUpdateResponse> {
		const query = getApiQuery(MINT_QUOTE_TTL_MUTATION,  { mint_quote_ttl_update: { [key]: value } });

		return this.http.post<OrchardRes<MintQuoteTtlUpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint quote ttl:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintNut04(unit:string, method:string, key:string, value:any) : Observable<MintNut04UpdateResponse> {
		const query = getApiQuery(MINT_NUT04_UPDATE_MUTATION, { mint_nut04_update: { unit, method, [key]: value } });

		return this.http.post<OrchardRes<MintNut04UpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint nut04:', error);
				return throwError(() => error);
			})
		);
	}

	public updateMintNut05(unit:string, method:string, key:string, value:any) : Observable<MintNut05UpdateResponse> {
		const query = getApiQuery(MINT_NUT05_UPDATE_MUTATION, { mint_nut05_update: { unit, method, [key]: value } });

		return this.http.post<OrchardRes<MintNut05UpdateResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint nut05:', error);
				return throwError(() => error);
			})
		);
	}

	public rotateMintKeysets(unit:string, input_fee_ppk:number, max_order:number) : Observable<MintKeysetRotationResponse> {
		const query = getApiQuery(MINT_KEYSETS_ROTATION_MUTATION, { mint_rotate_keyset: { unit, input_fee_ppk, max_order } });

		return this.http.post<OrchardRes<MintKeysetRotationResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error rotating mint keysets:', error);
				return throwError(() => error);
			})
		); 
	}

	public createMintDatabaseBackup() : Observable<MintDatabaseBackupResponse> {
		const query = getApiQuery(MINT_DATABASE_BACKUP_MUTATION, {});

		return this.http.post<OrchardRes<MintDatabaseBackupResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error creating mint database backup:', error);
				return throwError(() => error);
			})
		);
	}

	public restoreMintDatabaseBackup(filebase64:string) : Observable<MintDatabaseRestoreResponse> {
		const query = getApiQuery(MINT_DATABASE_RESTORE_MUTATION, { filebase64 });

		return this.http.post<OrchardRes<MintDatabaseRestoreResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error restoring mint database backup:', error);
				return throwError(() => error);
			})
		);
	}
	
	public updateMint(mutation:string, variables:Record<string, any>) {
		const query = getApiQuery(mutation, variables);

		return this.http.post<OrchardRes<any>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			catchError((error) => {
				console.error('Error updating mint:', error);
				return throwError(() => error);
			})
		);
	}
}