/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { FetchService } from '../fetch/fetch.service';
/* Internal Dependencies  */
import { CashuMintInfo } from './cashumintapi.types';

@Injectable()
export class CashuMintApiService {

  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
  ) {}

  async getMintInfo() : Promise<CashuMintInfo> {
    // @TODO : should we be error handling here?
    const response = await this.fetchService.fetchWithProxy(
      `${this.configService.get('cashu.api')}/v1/info`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.json();
  }
}