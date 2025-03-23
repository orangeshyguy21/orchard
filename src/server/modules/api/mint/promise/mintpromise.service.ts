/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintPromise } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintPromisesArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardApiErrorCode } from "@server/modules/graphql/errors/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintPromise } from './mintpromise.model';


@Injectable()
export class MintPromiseService {

	private readonly logger = new Logger(MintPromiseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintPromises(args?: CashuMintPromisesArgs) : Promise<OrchardMintPromise[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_promises : CashuMintPromise[] = await this.cashuMintDatabaseService.getMintPromises(db, args);
				return cashu_mint_promises.map( cmp => new OrchardMintPromise(cmp));
			} catch (error) {
				this.logger.error('Error getting mint promises from database');
				this.logger.debug(`Error getting mint promises from database: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}
}