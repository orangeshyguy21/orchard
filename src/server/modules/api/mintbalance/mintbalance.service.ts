/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintBalance } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintBalance } from './mintbalance.model';

@Injectable()
export class MintBalanceService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintBalances() : Promise<OrchardMintBalance[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_balances : CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalances(db);
      return cashu_mint_balances.map( cmb => new OrchardMintBalance(cmb) );
    } catch (error) {
      this.logger.error('Error getting outstanding mint balance', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }

  async getIssuedMintBalances() : Promise<OrchardMintBalance[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_balances_issued : CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesIssued(db);
      return cashu_mint_balances_issued.map( cmb => new OrchardMintBalance(cmb));
    } catch (error) {
      this.logger.error('Error getting issued mint balance', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }

  async getRedeemedMintBalances() : Promise<OrchardMintBalance[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_balances_redeemed : CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesRedeemed(db);
      return cashu_mint_balances_redeemed.map( cmb => new OrchardMintBalance(cmb) );
    } catch (error) {
      this.logger.error('Error getting redeemed  mint balance', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}