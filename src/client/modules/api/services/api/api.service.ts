/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Vendor Dependencies */
import {Client, createClient} from 'graphql-ws';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
/* Native Dependencies */
import {deriveWsScheme} from '@client/modules/api/helpers/api.helpers';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	public gql_client: Client;
	public api: string;

	constructor(
		private configService: ConfigService,
		private localStorageService: LocalStorageService,
	) {
		this.api = `${this.configService.config.api.proxy}/${this.configService.config.api.path}`;
		const ws_scheme = deriveWsScheme(window.location.protocol);
		this.gql_client = createClient({
			url: `${ws_scheme}//${window.location.host}${this.api}`,
			/**
			 * Evaluated each time the socket opens — picks up the latest access token
			 * from localStorage automatically after a refresh.
			 */
			connectionParams: () => ({authorization: this.localStorageService.getAuthToken() ?? ''}),
			lazy: true,
			/** Auth-refresh retries are owned by the consuming services; don't double-retry here. */
			retryAttempts: 0,
		});
	}
}
