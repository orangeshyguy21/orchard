/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '../../cashumintdb/cashumintdb.service';
import { CashuMintBalance, CashuMintBalanceIssued, CashuMintBalanceRedeemed } from '../../cashumintdb/cashumintdb.types';
/* Internal Dependencies */
import { OrchardMintBalance } from './mintbalance.model';

@Injectable()
export class MintBalanceService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getOutstandingMintBalance() : Promise<OrchardMintBalance> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const balances : CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalances(db);
      const primary_balance_index = 0;
      const balance = new OrchardMintBalance();
      balance.total_outstanding = balances[primary_balance_index]['s_issued - s_used'];
      return balance;
    } catch (error) {
      this.logger.error('Error getting outstanding mint balance', { error });
    } finally {
      db.close();
    }
  }

  async getIssuedMintBalance() : Promise<OrchardMintBalance["total_issued"]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const balances : CashuMintBalanceIssued[] = await this.cashuMintDatabaseService.getMintBalancesIssued(db);
      const primary_balance_index = 0;
      const balance = new OrchardMintBalance();
      balance.total_issued = balances[primary_balance_index]['balance'];
      return balance.total_issued;
    } catch (error) {
      this.logger.error('Error getting issued mint balance', { error });
    } finally {
      db.close();
    }
  }

  async getRedeemedMintBalance() : Promise<OrchardMintBalance["total_redeemed"]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const balances : CashuMintBalanceRedeemed[] = await this.cashuMintDatabaseService.getMintBalancesRedeemed(db);
      const primary_balance_index = 0;
      const balance = new OrchardMintBalance();
      balance.total_redeemed = balances[primary_balance_index]['balance'];
      return balance.total_redeemed;
    } catch (error) {
      this.logger.error('Error getting redeemed  mint balance', { error });
    } finally {
      db.close();
    }
  }
}