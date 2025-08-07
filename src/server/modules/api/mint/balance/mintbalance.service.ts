/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintBalance} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintBalance} from './mintbalance.model';

@Injectable()
export class MintBalanceService {
	private readonly logger = new Logger(MintBalanceService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintBalances(tag: string, keyset_id?: string): Promise<OrchardMintBalance[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_balances: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalances(client, keyset_id);
				return cashu_mint_balances.map((cmb) => new OrchardMintBalance(cmb));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getIssuedMintBalances(tag: string): Promise<OrchardMintBalance[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_balances_issued: CashuMintBalance[] = await this.cashuMintDatabaseService.getMintBalancesIssued(client);
				return cashu_mint_balances_issued.map((cmb) => new OrchardMintBalance(cmb));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getRedeemedMintBalances(tag: string): Promise<OrchardMintBalance[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_balances_redeemed: CashuMintBalance[] =
					await this.cashuMintDatabaseService.getMintBalancesRedeemed(client);
				return cashu_mint_balances_redeemed.map((cmb) => new OrchardMintBalance(cmb));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}
