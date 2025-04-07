/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { Observable, map, catchError, throwError } from 'rxjs';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
import { OrchardRes } from '@client/modules/api/types/api.types';
/* Shared Dependencies */
import { OrchardBitcoinBlockCount } from '@shared/generated.types';
/* Native Dependencies */
import { BitcoinBlockCountResponse } from '@client/modules/bitcoin/types/bitcoin.types';
import { BitcoinBlockCount } from '@client/modules/bitcoin/classes/bitcoin-blockcount.class';
/* Local Dependencies */
import { BITCOIN_BLOCK_COUNT_QUERY } from './bitcoin.queries';

@Injectable({
  providedIn: 'root'
})
export class BitcoinService {

  	constructor(private http: HttpClient) { }

	public getBlockCount() : Observable<OrchardBitcoinBlockCount> {

		const query = getApiQuery(BITCOIN_BLOCK_COUNT_QUERY);

		return this.http.post<OrchardRes<BitcoinBlockCountResponse>>(`${api}/bitcoin/blockcount`, query).pipe(
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

	public subscribeBlockCount() {
		console.log('Streaming block height');
		const eventSource = new EventSource(`${api}/events/blockheight`);
		
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Received data:', data);
		};
	}
}