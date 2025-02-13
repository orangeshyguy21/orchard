/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintPromise } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintPromise } from './mintpromise.model';

@Injectable()
export class MintPromiseService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintPromises() : Promise<OrchardMintPromise[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_promises : CashuMintPromise[] = await this.cashuMintDatabaseService.getMintPromises(db);
      return cashu_mint_promises.map( cmp => new OrchardMintPromise(cmp));
    } catch (error) {
      this.logger.error('Error getting mint promises from mint database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}