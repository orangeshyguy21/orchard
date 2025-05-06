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
	MintPromisesResponse,
	MintPromisesArgs,
	MintAnalyticsArgs,
	MintAnalyticsBalancesResponse,
	MintAnalyticsMintsResponse,
	MintAnalyticsMeltsResponse,
	MintAnalyticsTransfersResponse,
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
} from '@client/modules/mint/types/mint.types';
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintQuoteTtls } from '@client/modules/mint/classes/mint-quote-ttls.class';
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintPromise } from '@client/modules/mint/classes/mint-promise.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import { MintAnalyticsInterval, OrchardContact } from '@shared/generated.types';
/* Local Dependencies */
import { 
	MINT_INFO_QUERY, 
	MINT_INFO_RPC_QUERY,
	MINT_QUOTE_TTLS_QUERY,
	MINT_BALANCES_QUERY, 
	MINT_KEYSETS_QUERY, 
	MINT_PROMISES_QUERY, 
	MINT_ANALYTICS_BALANCES_QUERY, 
	MINT_ANALYTICS_MINTS_QUERY,
	MINT_ANALYTICS_MELTS_QUERY,
	MINT_ANALYTICS_TRANSFERS_QUERY,
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
		MINT_PROMISES: 'mint-promises',
		MINT_ANALYTICS_BALANCES: 'mint-analytics-balances',
		MINT_ANALYTICS_PRE_BALANCES: 'mint-analytics-pre-balances',
		MINT_ANALYTICS_MINTS: 'mint-analytics-mints',
		MINT_ANALYTICS_PRE_MINTS: 'mint-analytics-pre-mints',
		MINT_ANALYTICS_MELTS: 'mint-analytics-melts',
		MINT_ANALYTICS_PRE_MELTS: 'mint-analytics-pre-melts',
		MINT_ANALYTICS_TRANSFERS: 'mint-analytics-transfers',
		MINT_ANALYTICS_PRE_TRANSFERS: 'mint-analytics-pre-transfers',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.MINT_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.MINT_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_KEYSETS]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.MINT_PROMISES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_MINTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_MELTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS]: 5 * 60 * 1000, // 5 minutes
		[this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS]: 5 * 60 * 1000, // 5 minutes
	};

	/* Subjects for caching */
	private readonly mint_info_subject: BehaviorSubject<MintInfo | null>;
	private readonly mint_balances_subject: BehaviorSubject<MintBalance[] | null>;
	private readonly mint_keysets_subject: BehaviorSubject<MintKeyset[] | null>;
	private readonly mint_promises_subject: BehaviorSubject<MintPromise[] | null>;

	private readonly mint_analytics_balances_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_balances_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_mints_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_mints_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_melts_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_melts_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_transfers_subject: BehaviorSubject<MintAnalytic[] | null>;
	private readonly mint_analytics_pre_transfers_subject: BehaviorSubject<MintAnalytic[] | null>;

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
	}

	public clearInfoCache() {
		this.cache.clearCache(this.CACHE_KEYS.MINT_INFO);
	}

	public clearAnalyticsCache() {
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_BALANCES);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_MINTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_MINTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_MELTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_MELTS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_TRANSFERS);
		this.cache.clearCache(this.CACHE_KEYS.MINT_ANALYTICS_PRE_TRANSFERS);
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


	public loadMintPromises(args:MintPromisesArgs): Observable<MintPromise[]> {
		if (this.mint_promises_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_PROMISES)) {
			return of(this.mint_promises_subject.value);
		}

		const query = getApiQuery(MINT_PROMISES_QUERY, args);

		return this.http.post<OrchardRes<MintPromisesResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.mint_promises;
			}),
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