/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { FetchService } from '@server/modules/fetch/fetch.service';

@Injectable()
export class BitcoinService {

	constructor(
		private configService: ConfigService,
		private fetchService: FetchService,
	) {}

    async getBlockCount(): Promise<number> {
        const data_string = JSON.stringify({
            jsonrpc: "1.0",
            id: "curltext",
            method: "getblockcount",
            params: []
        });
        
        const user = this.configService.get('bitcoin.user');
        const pass = this.configService.get('bitcoin.pass');
        const host = this.configService.get('bitcoin.host');
        const port = this.configService.get('bitcoin.port');
        
        const response = await this.fetchService.fetchWithProxy(
            `http://${user}:${pass}@${host}:${port}/`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: data_string
            },
        );
        
        const result = await response.json();
        return result.result;
    }

}