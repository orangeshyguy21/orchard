/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {CashuMintMintQuote} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {CashuMintMintQuotesArgs} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {MintQuoteState} from '@server/modules/cashu/cashu.enums';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintMintQuote} from './mintmintquote.model';
import {MintNut04UpdateInput, MintNut04QuoteUpdateInput, MintNut04AdminIssueInput} from './mintmintquote.input';
import {OrchardMintNut04Update, OrchardMintNut04QuoteUpdate, OrchardMintNut04AdminIssue} from './mintmintquote.model';

@Injectable()
export class MintMintQuoteService {
	private readonly logger = new Logger(MintMintQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private cashuMintApiService: CashuMintApiService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMintQuotes(tag: string, args?: CashuMintMintQuotesArgs): Promise<OrchardMintMintQuote[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_quotes: CashuMintMintQuote[] = await this.cashuMintDatabaseService.getMintMintQuotes(client, args);
				return cashu_mint_quotes.map((cmq) => new OrchardMintMintQuote(cmq));
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	async updateMintNut04(tag: string, mint_nut04_update: MintNut04UpdateInput): Promise<OrchardMintNut04Update> {
		try {
			await this.cashuMintRpcService.updateNut04(mint_nut04_update);
			return mint_nut04_update;
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	async updateMintNut04Quote(tag: string, mint_nut04_quote_update: MintNut04QuoteUpdateInput): Promise<OrchardMintNut04QuoteUpdate> {
		try {
			await this.cashuMintRpcService.updateNut04Quote(mint_nut04_quote_update);
			return mint_nut04_quote_update;
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	async adminIssueMintNut04Quote(
		tag: string,
		mint_nut04_admin_issue: MintNut04AdminIssueInput,
	): Promise<OrchardMintNut04AdminIssue> {
		try {
			const created_quote = await this.cashuMintApiService.createMintNut04Quote(mint_nut04_admin_issue.method, {
				amount: mint_nut04_admin_issue.amount,
				unit: mint_nut04_admin_issue.unit,
				description: mint_nut04_admin_issue.description,
			});

			if (!created_quote.quote) throw new Error('Mint API response missing quote id');

			await this.cashuMintRpcService.updateNut04Quote({quote_id: created_quote.quote, state: MintQuoteState.PAID});

			return new OrchardMintNut04AdminIssue({
				quote_id: created_quote.quote,
				request: created_quote.request,
				amount: created_quote.amount ?? mint_nut04_admin_issue.amount,
				unit: created_quote.unit ?? mint_nut04_admin_issue.unit,
				state: MintQuoteState.PAID,
			});
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
