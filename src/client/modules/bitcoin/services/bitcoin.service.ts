/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { Observable } from 'rxjs';
/* Application Dependencies */
import { api } from '@client/modules/api/helpers/api.helpers';

@Injectable({
  providedIn: 'root'
})
export class BitcoinService {

  	constructor() { }

	public streamBlockHeight() {
		console.log('Streaming block height');
		const eventSource = new EventSource(`${api}/events/blockheight`);
		
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Received data:', data);
		};
	}
}

// @Sse('api/events/blockheight')