/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintRpcService } from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintQuoteTtls } from './mintquote.model';
import { UpdateQuoteTtlInput } from './mintquote.input';

@Injectable()
export class MintQuoteService {

	private readonly logger = new Logger(MintQuoteService.name);

	constructor(
		private cashuMintRpcService: CashuMintRpcService,
		private errorService: ErrorService,
	) {}

	async getMintQuoteTtl() : Promise<OrchardMintQuoteTtls> {
		try {
			return await this.cashuMintRpcService.getQuoteTtl();
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcActionError,
				msg: 'Error getting mint quote ttl from mint rpc',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintQuoteTtl(mint_quote_ttl_update: UpdateQuoteTtlInput) : Promise<OrchardMintQuoteTtls> {
		try {
			await this.cashuMintRpcService.updateQuoteTtl(mint_quote_ttl_update);
			return mint_quote_ttl_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcActionError,
				msg: 'Error updating mint quote ttl',
			});
			throw new OrchardApiError(error_code);
		}
	}
}