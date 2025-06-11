/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
import { OrchardRes } from '@client/modules/api/types/api.types';
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
/* Shared Dependencies */
import { OrchardBitcoinBlockCount } from '@shared/generated.types';
/* Native Dependencies */
import { BitcoinBlockCount } from '@client/modules/bitcoin/classes/bitcoin-blockcount.class';
import { BitcoinInfo } from '@client/modules/bitcoin/classes/bitcoin-info.class';
import {
	BitcoinInfoResponse,
	BitcoinBlockCountResponse,
} from '@client/modules/bitcoin/types/bitcoin.types';
/* Local Dependencies */
import { 
	BITCOIN_INFO_QUERY,
	BITCOIN_BLOCK_COUNT_QUERY,
} from './bitcoin.queries';

@Injectable({
  	providedIn: 'root'
})
export class BitcoinService {

	public get bitcoin_info$(): Observable<BitcoinInfo | null> { return this.bitcoin_info_subject.asObservable(); }

	public readonly CACHE_KEYS = {
		BITCOIN_INFO: 'bitcoin-info',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.BITCOIN_INFO]: 30 * 60 * 1000, // 30 minutes
	};

	/* Subjects for caching */
	private readonly bitcoin_info_subject: BehaviorSubject<BitcoinInfo | null>;

	/* Observables for caching (rapid request caching) */
	private bitcoin_info_observable!: Observable<BitcoinInfo> | null;

	constructor(
		public http: HttpClient,
		public cache: CacheService,
	) {
		this.bitcoin_info_subject = this.cache.createCache<BitcoinInfo>(
			this.CACHE_KEYS.BITCOIN_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.BITCOIN_INFO]
		);
	}

	public loadBitcoinInfo(): Observable<BitcoinInfo> {
		if ( this.bitcoin_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.BITCOIN_INFO) ) return of(this.bitcoin_info_subject.value);
		if ( this.bitcoin_info_observable ) return this.bitcoin_info_observable;
		const query = getApiQuery(BITCOIN_INFO_QUERY);
		this.bitcoin_info_observable = this.http.post<OrchardRes<BitcoinInfoResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.bitcoin_info;
			}),
			map((btc_info) => new BitcoinInfo(btc_info)),
			tap((btc_info) => {
				this.cache.updateCache(this.CACHE_KEYS.BITCOIN_INFO, btc_info);
				this.bitcoin_info_subject.next(btc_info);
				this.bitcoin_info_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				console.error('Error loading bitcoin info:', error);
				this.bitcoin_info_observable = null;
				return throwError(() => error);
			}),
		);
		return this.bitcoin_info_observable;
	}

	public getBlockCount() : Observable<OrchardBitcoinBlockCount> {
		const query = getApiQuery(BITCOIN_BLOCK_COUNT_QUERY);
		return this.http.post<OrchardRes<BitcoinBlockCountResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.bitcoin_blockcount;
			}),
			map((bitcoin_blockcount) => new BitcoinBlockCount(bitcoin_blockcount)),
			catchError((error) => {
				console.error('Error loading bitcoin block count:', error);
				return throwError(() => error);
			})
		);
	}
}