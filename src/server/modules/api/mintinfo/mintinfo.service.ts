/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintApiService } from '@server/modules/cashumintapi/cashumintapi.service';
import { CashuMintInfo } from '@server/modules/cashumintapi/cashumintapi.types';
/* Local Dependencies */
import { OrchardMintInfo } from './mintinfo.model';

@Injectable()
export class MintInfoService {

  constructor(
    private cashuMintApiService: CashuMintApiService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintInfo() : Promise<OrchardMintInfo> {
    try {
      const cashu_info : CashuMintInfo = await this.cashuMintApiService.getMintInfo();
      return new OrchardMintInfo(cashu_info);
    } catch (error) {
      this.logger.error('Error getting mint information from mint api', { error });
      throw new Error(error);
    }
  }
}