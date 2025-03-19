/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintPromise } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintPromisesArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
/* Local Dependencies */
import { OrchardMintPromise } from './mintpromise.model';


@Injectable()
export class MintPromiseService {

	private readonly logger = new Logger(MintPromiseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintPromises(args?: CashuMintPromisesArgs) : Promise<OrchardMintPromise[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_promises : CashuMintPromise[] = await this.cashuMintDatabaseService.getMintPromises(db, args);
			return cashu_mint_promises.map( cmp => new OrchardMintPromise(cmp));
		} catch (error) {
			this.logger.error('Error getting mint promises from mint database', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}