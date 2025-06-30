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
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {
	BitcoinBlockchainInfoResponse,
	BitcoinBlockCountResponse,
	BitcoinNetworkInfoResponse,
} from '@client/modules/bitcoin/types/bitcoin.types';
/* Local Dependencies */
import { 
	BITCOIN_BLOCKCHAIN_INFO_QUERY,
	BITCOIN_BLOCK_COUNT_QUERY,
	BITCOIN_NETWORK_INFO_QUERY,
} from './bitcoin.queries';

@Injectable({
  	providedIn: 'root'
})
export class BitcoinService {

	public get bitcoin_blockcount$(): Observable<BitcoinBlockCount | null> { return this.bitcoin_block_subject.asObservable(); }
	public get bitcoin_blockchain_info$(): Observable<BitcoinBlockchainInfo | null> { return this.bitcoin_blockchain_info_subject.asObservable(); }

	public readonly CACHE_KEYS = {
		BITCOIN_BLOCKCOUNT: 'bitcoin-blockcount',
		BITCOIN_BLOCKCHAIN_INFO: 'bitcoin-blockchain-info',
		BITCOIN_NETWORK_INFO: 'bitcoin-network-info',
	};

	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.BITCOIN_BLOCKCOUNT]: 1 * 60 * 1000, // 1 minute
		[this.CACHE_KEYS.BITCOIN_BLOCKCHAIN_INFO]: 30 * 60 * 1000, // 30 minutes
		[this.CACHE_KEYS.BITCOIN_NETWORK_INFO]: 30 * 60 * 1000, // 30 minutes
	};

	/* Subjects for caching */
	private readonly bitcoin_block_subject!: BehaviorSubject<BitcoinBlockCount | null>;
	private readonly bitcoin_blockchain_info_subject: BehaviorSubject<BitcoinBlockchainInfo | null>;
	private readonly bitcoin_network_info_subject: BehaviorSubject<BitcoinNetworkInfo | null>;

	/* Observables for caching (rapid request caching) */
	private bitcoin_blockchain_info_observable!: Observable<BitcoinBlockchainInfo> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
	) {
		this.bitcoin_block_subject = new BehaviorSubject<BitcoinBlockCount | null>(null);
		this.bitcoin_blockchain_info_subject = this.cache.createCache<BitcoinBlockchainInfo>(
			this.CACHE_KEYS.BITCOIN_BLOCKCHAIN_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.BITCOIN_BLOCKCHAIN_INFO]
		);
		this.bitcoin_network_info_subject = this.cache.createCache<BitcoinNetworkInfo>(
			this.CACHE_KEYS.BITCOIN_NETWORK_INFO,
			this.CACHE_DURATIONS[this.CACHE_KEYS.BITCOIN_NETWORK_INFO]
		);
	}

	public loadBitcoinBlockchainInfo(): Observable<BitcoinBlockchainInfo> {
		if ( this.bitcoin_blockchain_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.BITCOIN_BLOCKCHAIN_INFO) ) return of(this.bitcoin_blockchain_info_subject.value);
		if ( this.bitcoin_blockchain_info_observable ) return this.bitcoin_blockchain_info_observable;
		
		const query = getApiQuery(BITCOIN_BLOCKCHAIN_INFO_QUERY);
		
		this.bitcoin_blockchain_info_observable = this.http.post<OrchardRes<BitcoinBlockchainInfoResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.bitcoin_blockchain_info;
			}),
			map((btc_info) => new BitcoinBlockchainInfo(btc_info)),
			tap((btc_info) => {
				this.cache.updateCache(this.CACHE_KEYS.BITCOIN_BLOCKCHAIN_INFO, btc_info);
				this.bitcoin_blockchain_info_subject.next(btc_info);
				this.bitcoin_blockchain_info_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				this.bitcoin_blockchain_info_observable = null;
				return throwError(() => error);
			}),
		);
		return this.bitcoin_blockchain_info_observable;
	}

	public loadBitcoinNetworkInfo(): Observable<BitcoinNetworkInfo> {
		if ( this.bitcoin_network_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.BITCOIN_NETWORK_INFO) ) {
			return of(this.bitcoin_network_info_subject.value);
		}

		const query = getApiQuery(BITCOIN_NETWORK_INFO_QUERY);

		return this.http.post<OrchardRes<BitcoinNetworkInfoResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.bitcoin_network_info;
			}),
			map((bitcoin_network_info) => new BitcoinNetworkInfo(bitcoin_network_info)),
			tap((mint_keysets) => {
				this.cache.updateCache(this.CACHE_KEYS.BITCOIN_NETWORK_INFO, mint_keysets);
			}),
			catchError((error) => {
				console.error('Error loading bitcoin network info:', error);
				return throwError(() => error);
			})
		);
	}

	public getBlockCount() : Observable<OrchardBitcoinBlockCount> {
		const query = getApiQuery(BITCOIN_BLOCK_COUNT_QUERY);

		return this.http.post<OrchardRes<BitcoinBlockCountResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.bitcoin_blockcount;
			}),
			map((bitcoin_blockcount) => new BitcoinBlockCount(bitcoin_blockcount)),
			tap((bitcoin_blockcount) => {
                this.bitcoin_block_subject.next(bitcoin_blockcount);
            }),
			catchError((error) => {
				console.error('Error loading bitcoin block count:', error);
				return throwError(() => error);
			})
		);
	}
}