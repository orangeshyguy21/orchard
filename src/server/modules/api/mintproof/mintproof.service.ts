/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintProof } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintProof } from './mintproof.model';

@Injectable()
export class MintProofService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintProofsPending() : Promise<OrchardMintProof[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofsPending(db);
      return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
    } catch (error) {
      this.logger.error('Error getting mint promises from mint database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }

  async getMintProofsUsed() : Promise<OrchardMintProof[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofsUsed(db);
      return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
    } catch (error) {
      this.logger.error('Error getting mint proofs from mint database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}