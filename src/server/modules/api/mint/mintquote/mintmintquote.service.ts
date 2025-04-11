/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintRpcService } from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import { CashuMintMintQuote } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintMintQuotesArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintMintQuote } from './mintmintquote.model';
import { UpdateNut04Input, UpdateNut04QuoteInput } from './mintmintquote.input';
import { UpdateNut04Output, UpdateNut04QuoteOutput } from './mintmintquote.model';

@Injectable()
export class MintMintQuoteService {

	private readonly logger = new Logger(MintMintQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMintQuotes(args?: CashuMintMintQuotesArgs) : Promise<OrchardMintMintQuote[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_quotes : CashuMintMintQuote[] = await this.cashuMintDatabaseService.getMintMintQuotes(db, args);
				return cashu_mint_quotes.map( cmq => new OrchardMintMintQuote(cmq));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint quotes from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async updateMintNut04(updateNut04Input: UpdateNut04Input) : Promise<UpdateNut04Output> {
		try {
			await this.cashuMintRpcService.updateNut04(updateNut04Input);
			return updateNut04Input;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcActionError,
				msg: 'Error updating mint nut04',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintNut04Quote(updateNut04QuoteInput: UpdateNut04QuoteInput) : Promise<UpdateNut04QuoteOutput> {
		try {
			return await this.cashuMintRpcService.updateNut04Quote(updateNut04QuoteInput);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcActionError,
				msg: 'Error updating mint nut04 quote',
			});
			throw new OrchardApiError(error_code);
		}
	}
}