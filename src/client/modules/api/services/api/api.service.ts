/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Vendor Dependencies */
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	public gql_socket: WebSocketSubject<any>;
	public api: string;

	constructor(private configService: ConfigService) {
		this.api = `${this.configService.config.api.proxy}/${this.configService.config.api.path}`;
		this.gql_socket = webSocket({
			url: `ws://${window.location.host}${this.api}`,
			protocol: 'graphql-ws',
		});
	}
}
