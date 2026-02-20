/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies  */
import {CashuMintInfo, CashuMintNut04QuoteCreateRequest, CashuMintNut04QuoteCreateResponse} from './cashumintapi.types';

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

	async createMintNut04Quote(
		method: string,
		payload: CashuMintNut04QuoteCreateRequest,
	): Promise<CashuMintNut04QuoteCreateResponse> {
		const response = await this.fetchService.fetchWithProxy(`${this.configService.get('cashu.api')}/v1/mint/quote/${method}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			const error_body = await response.text();
			throw new Error(`Mint API quote creation failed (${response.status}): ${error_body}`);
		}
		return response.json();
	}
}
