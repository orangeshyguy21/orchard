/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintMeltQuote } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintMeltQuote } from './mintmeltquote.model';

@Injectable()
export class MintMeltQuoteService {

	private readonly logger = new Logger(MintMeltQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMeltQuotes() : Promise<OrchardMintMeltQuote[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_melt_quotes : CashuMintMeltQuote[] = await this.cashuMintDatabaseService.getMintMeltQuotes(db);
				return cashu_melt_quotes.map( cmq => new OrchardMintMeltQuote(cmq));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting melt quotes from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}