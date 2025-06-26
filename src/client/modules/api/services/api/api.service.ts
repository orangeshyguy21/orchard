/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
/* Application Dependencies */
import { api } from '@client/modules/api/helpers/api.helpers';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	public gql_socket: WebSocketSubject<any>;

	constructor(
		public http: HttpClient,
	) {
		this.gql_socket = webSocket({
			url: `ws://${window.location.host}${api}`,
			protocol: 'graphql-ws',
		})
	}
}