/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintMintQuote } from '@server/modules/cashumintdb/cashumintdb.types';
import { CashuMintMintQuotesArgs } from '@server/modules/cashumintdb/cashumintdb.interfaces';
/* Local Dependencies */
import { OrchardMintMintQuote } from './mintmintquote.model';

@Injectable()
export class MintMintQuoteService {

	private readonly logger = new Logger(MintMintQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintMintQuotes(args?: CashuMintMintQuotesArgs) : Promise<OrchardMintMintQuote[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_quotes : CashuMintMintQuote[] = await this.cashuMintDatabaseService.getMintMintQuotes(db, args);
			return cashu_mint_quotes.map( cmq => new OrchardMintMintQuote(cmq));
		} catch (error) {
			this.logger.error('Error getting mint quotes from mint database', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}