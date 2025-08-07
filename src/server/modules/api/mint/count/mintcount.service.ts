/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {
	CashuMintMintQuotesArgs,
	CashuMintMeltQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintCount} from './mintcount.model';

@Injectable()
export class MintCountService {
	private readonly logger = new Logger(MintCountService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintCountMintQuotes(tag: string, args?: CashuMintMintQuotesArgs): Promise<OrchardMintCount> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const count: number = await this.cashuMintDatabaseService.getMintCountMintQuotes(client, args);
				return new OrchardMintCount(count);
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintCountMeltQuotes(tag: string, args?: CashuMintMeltQuotesArgs): Promise<OrchardMintCount> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const count: number = await this.cashuMintDatabaseService.getMintCountMeltQuotes(client, args);
				return new OrchardMintCount(count);
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintCountProofGroups(tag: string, args?: CashuMintProofsArgs): Promise<OrchardMintCount> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const count: number = await this.cashuMintDatabaseService.getMintCountProofGroups(client, args);
				return new OrchardMintCount(count);
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintCountPromiseGroups(tag: string, args?: CashuMintPromiseArgs): Promise<OrchardMintCount> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const count: number = await this.cashuMintDatabaseService.getMintCountPromiseGroups(client, args);
				return new OrchardMintCount(count);
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}
