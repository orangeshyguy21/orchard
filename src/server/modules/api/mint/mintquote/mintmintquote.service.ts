/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintMintQuote } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintMintQuotesArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintMintQuote } from './mintmintquote.model';

@Injectable()
export class MintMintQuoteService {

	private readonly logger = new Logger(MintMintQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintMintQuotes(args?: CashuMintMintQuotesArgs) : Promise<OrchardMintMintQuote[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_quotes : CashuMintMintQuote[] = await this.cashuMintDatabaseService.getMintMintQuotes(db, args);
				return cashu_mint_quotes.map( cmq => new OrchardMintMintQuote(cmq));
			} catch (error) {
				this.logger.error('Error getting mint quotes from database');
				this.logger.debug(`Error getting mint quotes from database: ${error}`);
				let error_code = OrchardErrorCode.MintDatabaseSelectError;
				if( error === OrchardErrorCode.MintSupportError ) error_code = OrchardErrorCode.MintSupportError;
				throw new OrchardApiError(error_code);
			}
		});
	}
}