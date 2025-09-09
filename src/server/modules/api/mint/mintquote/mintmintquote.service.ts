/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {CashuMintMintQuote} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {CashuMintMintQuotesArgs} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintMintQuote} from './mintmintquote.model';
import {MintNut04UpdateInput, MintNut04QuoteUpdateInput} from './mintmintquote.input';
import {OrchardMintNut04Update, OrchardMintNut04QuoteUpdate} from './mintmintquote.model';

@Injectable()
export class MintMintQuoteService {
	private readonly logger = new Logger(MintMintQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMintQuotes(tag: string, args?: CashuMintMintQuotesArgs): Promise<OrchardMintMintQuote[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_quotes: CashuMintMintQuote[] = await this.cashuMintDatabaseService.getMintMintQuotes(client, args);
				console.log('cashu_mint_quotes', cashu_mint_quotes.map((cmq) => new OrchardMintMintQuote(cmq)));
				return cashu_mint_quotes.map((cmq) => new OrchardMintMintQuote(cmq));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async updateMintNut04(tag: string, mint_nut04_update: MintNut04UpdateInput): Promise<OrchardMintNut04Update> {
		try {
			await this.cashuMintRpcService.updateNut04(mint_nut04_update);
			return mint_nut04_update;
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintNut04Quote(tag: string, mint_nut04_quote_update: MintNut04QuoteUpdateInput): Promise<OrchardMintNut04QuoteUpdate> {
		try {
			return await this.cashuMintRpcService.updateNut04Quote(mint_nut04_quote_update);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
