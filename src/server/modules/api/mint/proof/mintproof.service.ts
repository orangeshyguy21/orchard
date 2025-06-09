/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintProofGroup } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintProofsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintProofGroup } from './mintproof.model';

@Injectable()
export class MintProofService {

	private readonly logger = new Logger(MintProofService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintProofGroups(tag: string, args?: CashuMintProofsArgs) : Promise<OrchardMintProofGroup[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_pgs : CashuMintProofGroup[] = await this.cashuMintDatabaseService.getMintProofGroups(db, args);
				return cashu_mint_pgs.map( cpg => new OrchardMintProofGroup(cpg));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});	
	}
}