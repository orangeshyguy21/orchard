/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintMintQuotesArgs, CashuMintMeltQuotesArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintCount } from './mintcount.model';

@Injectable()
export class MintCountService {

	private readonly logger = new Logger(MintCountService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintCountMintQuotes(args?: CashuMintMintQuotesArgs) : Promise<OrchardMintCount> {
		return this.mintService.withDb(async (db) => {
			try {
				const count : number = await this.cashuMintDatabaseService.getMintCountMintQuotes(db, args);
				return new OrchardMintCount(count);
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error counting mint quotes from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintCountMeltQuotes(args?: CashuMintMeltQuotesArgs) : Promise<OrchardMintCount> {
		return this.mintService.withDb(async (db) => {
			try {
				const count : number = await this.cashuMintDatabaseService.getMintCountMeltQuotes(db, args);
				return new OrchardMintCount(count);
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error counting melt quotes from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}