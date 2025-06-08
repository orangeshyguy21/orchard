/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintTransaction } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintProofsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintTransaction } from './minttransaction.model';


@Injectable()
export class MintTransactionService {

	private readonly logger = new Logger(MintTransactionService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintTransactions(args?: CashuMintProofsArgs) : Promise<OrchardMintTransaction[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_transactions : CashuMintTransaction[] = await this.cashuMintDatabaseService.getMintTransactions(db, args);
				return cashu_mint_transactions.map( cmp => new OrchardMintTransaction(cmp));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint transactions from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}