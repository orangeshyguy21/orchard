/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { CashuService } from '../../cashu/cashu.service';
/* Application Models */
import { Liabilities } from './liabilities.model';
import { CashuBalance, CashuBalanceIssued, CashuBalanceRedeemed } from '../../cashu/cashu.types';

@Injectable()
export class LiabilitiesService {

  constructor(
    private cashuService: CashuService,
  ) {}

  async getOutstandingLiabilites() : Promise<Liabilities> {
    const db = this.cashuService.getDatabase();
    try {
      const balances : CashuBalance[] = await this.cashuService.getBalances(db);
      const primary_balance_index = 0;
      const liabilites = new Liabilities();
      liabilites.total_outstanding = balances[primary_balance_index]['s_issued - s_used'];
      return liabilites;
    } catch (err) {
      console.log('caught err', err);
    } finally {
      db.close();
    }
  }

  async getIssuedLiabilities() : Promise<Liabilities["total_issued"]> {
    const db = this.cashuService.getDatabase();
    try {
      const balances : CashuBalanceIssued[] = await this.cashuService.getBalancesIssued(db);
      const primary_balance_index = 0;
      const liabilites = new Liabilities();
      liabilites.total_issued = balances[primary_balance_index]['balance'];
      return liabilites.total_issued;
    } catch (err) {
      console.log('caught err', err);
    } finally {
      db.close();
    }
  }

  async getRedeemedLiabilities() : Promise<Liabilities["total_redeemed"]> {
    const db = this.cashuService.getDatabase();
    try {
      const balances : CashuBalanceRedeemed[] = await this.cashuService.getBalancesRedeemed(db);
      const primary_balance_index = 0;
      const liabilites = new Liabilities();
      liabilites.total_redeemed = balances[primary_balance_index]['balance'];
      return liabilites.total_redeemed;
    } catch (err) {
      console.log('caught err', err);
    } finally {
      db.close();
    }
  }

}