/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintRpcService } from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import { CashuMintMeltQuote } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintMeltQuotesArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintMeltQuote, OrchardMintNut05Update } from './mintmeltquote.model';
import { MintNut05UpdateInput } from './mintmeltquote.input';

@Injectable()
export class MintMeltQuoteService {

	private readonly logger = new Logger(MintMeltQuoteService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintMeltQuotes(args?: CashuMintMeltQuotesArgs) : Promise<OrchardMintMeltQuote[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_melt_quotes : CashuMintMeltQuote[] = await this.cashuMintDatabaseService.getMintMeltQuotes(db, args);
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

	async updateMintNut05(mint_nut05_update: MintNut05UpdateInput) : Promise<OrchardMintNut05Update> {
		try {
			await this.cashuMintRpcService.updateNut05(mint_nut05_update);
			return mint_nut05_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcActionError,
				msg: 'Error updating mint nut05',
			});
			throw new OrchardApiError(error_code);
		}
	}
}