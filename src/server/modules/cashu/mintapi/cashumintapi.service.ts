/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies  */
import {CashuMintInfo} from './cashumintapi.types';

@Injectable()
export class CashuMintApiService {
	constructor(
		private configService: ConfigService,
		private fetchService: FetchService,
	) {}

	async getMintInfo(): Promise<CashuMintInfo> {
		const response = await this.fetchService.fetchWithProxy(`${this.configService.get('cashu.api')}/v1/info`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
		});
		return response.json();
	}
}
