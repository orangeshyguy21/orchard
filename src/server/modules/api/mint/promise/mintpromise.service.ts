/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintPromiseGroup} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintPromiseGroup} from './mintpromise.model';

@Injectable()
export class MintPromiseService {
	private readonly logger = new Logger(MintPromiseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintPromiseGroups(tag: string, args?: any): Promise<OrchardMintPromiseGroup[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_promise_groups: CashuMintPromiseGroup[] = await this.cashuMintDatabaseService.getMintPromiseGroups(
					db,
					args,
				);
				return cashu_mint_promise_groups.map((cmp) => new OrchardMintPromiseGroup(cmp));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}
