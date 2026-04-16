/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Vendor Dependencies */
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
/* Native Dependencies */
import {deriveWsScheme} from '@client/modules/api/helpers/api.helpers';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	public gql_socket: WebSocketSubject<any>;
	public api: string;

	constructor(private configService: ConfigService) {
		this.api = `${this.configService.config.api.proxy}/${this.configService.config.api.path}`;
		const ws_scheme = deriveWsScheme(window.location.protocol);
		this.gql_socket = webSocket({
			url: `${ws_scheme}//${window.location.host}${this.api}`,
			protocol: 'graphql-ws',
		});
	}
}
