/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintMeltQuote } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardApiErrorCode } from "@server/modules/graphql/errors/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintMeltQuote } from './mintmeltquote.model';

@Injectable()
export class MintMeltQuoteService {

	private readonly logger = new Logger(MintMeltQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintMeltQuotes() : Promise<OrchardMintMeltQuote[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_melt_quotes : CashuMintMeltQuote[] = await this.cashuMintDatabaseService.getMintMeltQuotes(db);
				return cashu_melt_quotes.map( cmq => new OrchardMintMeltQuote(cmq));
			} catch (error) {
				this.logger.error('Error getting mint melt quotes from database');
				this.logger.debug(`Error getting mint melt quotes from database: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}
}