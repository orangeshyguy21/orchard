/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintRpcService } from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintQuoteTtls } from './mintquote.model';
import { MintQuoteTtlUpdateInput } from './mintquote.input';

@Injectable()
export class MintQuoteService {

	private readonly logger = new Logger(MintQuoteService.name);

	constructor(
		private cashuMintRpcService: CashuMintRpcService,
		private errorService: ErrorService,
	) {}

	async getMintQuoteTtl(tag: string) : Promise<OrchardMintQuoteTtls> {
		try {
			return await this.cashuMintRpcService.getQuoteTtl();
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintQuoteTtl(tag: string, mint_quote_ttl_update: MintQuoteTtlUpdateInput) : Promise<OrchardMintQuoteTtls> {
		try {
			await this.cashuMintRpcService.updateQuoteTtl(mint_quote_ttl_update);
			return mint_quote_ttl_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}