/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintProof, CashuMintProofGroup } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintProofsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintProof, OrchardMintProofGroup } from './mintproof.model';

@Injectable()
export class MintProofService {

	private readonly logger = new Logger(MintProofService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintProofs() : Promise<OrchardMintProof[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofs(db);
				return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint proofs from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintProofGroups(args?: CashuMintProofsArgs) : Promise<OrchardMintProofGroup[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_pgs : CashuMintProofGroup[] = await this.cashuMintDatabaseService.getMintProofGroups(db, args);
				return cashu_mint_pgs.map( cpg => new OrchardMintProofGroup(cpg));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint proof groups from database',
				});
				throw new OrchardApiError(error_code);
			}
		});	
	}
}