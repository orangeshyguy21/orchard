/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuService } from '../../cashu/cashu.service';
/* Application Models */
import { Balance } from './balance.model';
import { CashuBalance, CashuBalanceIssued, CashuBalanceRedeemed } from '../../cashu/cashu.types';

@Injectable()
export class BalanceService {

  constructor(
    private cashuService: CashuService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getOutstandingBalance() : Promise<Balance> {
    const db = this.cashuService.getDatabase();
    try {
      const balances : CashuBalance[] = await this.cashuService.getBalances(db);
      const primary_balance_index = 0;
      const balance = new Balance();
      balance.total_outstanding = balances[primary_balance_index]['s_issued - s_used'];
      return balance;
    } catch (error) {
      this.logger.error('Error getting outstanding mint balance', { error });
    } finally {
      db.close();
    }
  }

  async getIssuedBalance() : Promise<Balance["total_issued"]> {
    const db = this.cashuService.getDatabase();
    try {
      const balances : CashuBalanceIssued[] = await this.cashuService.getBalancesIssued(db);
      const primary_balance_index = 0;
      const balance = new Balance();
      balance.total_issued = balances[primary_balance_index]['balance'];
      return balance.total_issued;
    } catch (error) {
      this.logger.error('Error getting issued mint balance', { error });
    } finally {
      db.close();
    }
  }

  async getRedeemedBalance() : Promise<Balance["total_redeemed"]> {
    const db = this.cashuService.getDatabase();
    try {
      const balances : CashuBalanceRedeemed[] = await this.cashuService.getBalancesRedeemed(db);
      const primary_balance_index = 0;
      const balance = new Balance();
      balance.total_redeemed = balances[primary_balance_index]['balance'];
      return balance.total_redeemed;
    } catch (error) {
      this.logger.error('Error getting redeemed  mint balance', { error });
    } finally {
      db.close();
    }
  }
}