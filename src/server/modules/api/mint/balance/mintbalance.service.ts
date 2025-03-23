/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintBalance } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardApiErrorCode } from "@server/modules/graphql/errors/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintBalance } from './mintbalance.model';

@Injectable()
export class MintBalanceService {

	private readonly logger = new Logger(MintBalanceService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintBalances(): Promise<OrchardMintBalance[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_balances: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalances(db);
				return cashu_mint_balances.map(cmb => new OrchardMintBalance(cmb));
			} catch (error) {
				this.logger.error('Error getting mint balances');
				this.logger.debug(`Error getting mint balances: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}

	async getIssuedMintBalances(): Promise<OrchardMintBalance[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_balances_issued: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesIssued(db);
				return cashu_mint_balances_issued.map(cmb => new OrchardMintBalance(cmb));
			} catch (error) {
				this.logger.error('Error getting issued mint balances');
				this.logger.debug(`Error getting issued mint balances: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}

	async getRedeemedMintBalances(): Promise<OrchardMintBalance[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_balances_redeemed: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesRedeemed(db);
				return cashu_mint_balances_redeemed.map(cmb => new OrchardMintBalance(cmb));
			} catch (error) {
				this.logger.error('Error getting redeemed mint balances');
				this.logger.debug(`Error getting redeemed mint balances: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}
}