/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {CashuMintMeltQuote} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {CashuMintMeltQuotesArgs} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintMeltQuote, OrchardMintNut05Update, OrchardMintNut05QuoteUpdate} from './mintmeltquote.model';
import {MintNut05UpdateInput, MintNut05QuoteUpdateInput} from './mintmeltquote.input';

@Injectable()
export class MintMeltQuoteService {
	private readonly logger = new Logger(MintMeltQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMeltQuotes(tag: string, args?: CashuMintMeltQuotesArgs): Promise<OrchardMintMeltQuote[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_melt_quotes: CashuMintMeltQuote[] = await this.cashuMintDatabaseService.getMintMeltQuotes(client, args);
				return cashu_melt_quotes.map((cmq) => new OrchardMintMeltQuote(cmq));
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	async updateMintNut05(tag: string, mint_nut05_update: MintNut05UpdateInput): Promise<OrchardMintNut05Update> {
		try {
			await this.cashuMintRpcService.updateNut05(mint_nut05_update);
			return mint_nut05_update;
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	async updateMintNut05Quote(tag: string, mint_nut05_quote_update: MintNut05QuoteUpdateInput): Promise<OrchardMintNut05QuoteUpdate> {
		try {
			return await this.cashuMintRpcService.updateNut05Quote(mint_nut05_quote_update);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
