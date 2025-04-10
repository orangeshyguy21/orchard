/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { map, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
/* Shared Dependencies */
import { OrchardStatus } from '@shared/generated.types';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardRes, StatusResponse } from '@client/modules/api/types/api.types';
/* Local Dependencies */
import { STATUS_QUERY } from './api.queries';

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
			protocol: 'graphql-ws'
		})
	}

	public getStatus(): Observable<OrchardStatus> {
		const query = getApiQuery(STATUS_QUERY);
		return this.http.post<OrchardRes<StatusResponse>>(api, query)
			.pipe(
				map((response) => response.data.status)
			);
	}
}