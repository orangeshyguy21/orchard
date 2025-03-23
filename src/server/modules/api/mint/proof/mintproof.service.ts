/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintProof } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardApiErrorCode } from "@server/modules/graphql/errors/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintProof } from './mintproof.model';

@Injectable()
export class MintProofService {

	private readonly logger = new Logger(MintProofService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintProofsPending() : Promise<OrchardMintProof[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofsPending(db);
				return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
			} catch (error) {
				this.logger.error('Error getting mint pending proofs from database');
				this.logger.debug(`Error getting mint pending proofs from database: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}

	async getMintProofsUsed() : Promise<OrchardMintProof[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofsUsed(db);
				return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
			} catch (error) {
				this.logger.error('Error getting mint used proofs from database');
				this.logger.debug(`Error getting mint used proofs from database: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}
}