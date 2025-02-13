/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintKeyset } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintKeyset } from './mintkeyset.model';

@Injectable()
export class MintKeysetService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintKeysets() : Promise<OrchardMintKeyset[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_keysets : CashuMintKeyset[] = await this.cashuMintDatabaseService.getMintKeysets(db);
      return cashu_keysets.map( ck => new OrchardMintKeyset(ck));
    } catch (error) {
      this.logger.error('Error getting keysets from mint database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}