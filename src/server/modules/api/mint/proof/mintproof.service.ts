/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintProofGroup} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {CashuMintProofsArgs} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {median} from '@server/modules/math/median';
/* Native Dependencies */
import {MintUnit, MintProofState} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {OrchardMintProofGroup, OrchardMintProofGroupStats} from './mintproof.model';

@Injectable()
export class MintProofService {
	private readonly logger = new Logger(MintProofService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintProofGroups(tag: string, args?: CashuMintProofsArgs): Promise<OrchardMintProofGroup[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_pgs: CashuMintProofGroup[] = await this.cashuMintDatabaseService.getMintProofGroups(client, args);
				return cashu_mint_pgs.map((cpg) => new OrchardMintProofGroup(cpg));
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	async getMintProofGroupStats(tag: string, unit: MintUnit): Promise<OrchardMintProofGroupStats> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_mint_pgs: CashuMintProofGroup[] = await this.cashuMintDatabaseService.getMintProofGroups(client, {
					units: [unit],
					states: [MintProofState.SPENT],
					page: 1,
					page_size: 500,
				});
				const notes_used = cashu_mint_pgs.map((cpg) => cpg.amounts.flat().length);
				return {
					median: median(notes_used),
				};
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}
}
