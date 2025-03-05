/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintProof } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintProof } from './mintproof.model';

@Injectable()
export class MintProofService {

	private readonly logger = new Logger(MintProofService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintProofsPending() : Promise<OrchardMintProof[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofsPending(db);
			return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
		} catch (error) {
			this.logger.error('Error getting mint promises from mint database', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}

	async getMintProofsUsed() : Promise<OrchardMintProof[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_proofs : CashuMintProof[] = await this.cashuMintDatabaseService.getMintProofsUsed(db);
			return cashu_mint_proofs.map( cmp => new OrchardMintProof(cmp));
		} catch (error) {
			this.logger.error('Error getting mint proofs from mint database', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}