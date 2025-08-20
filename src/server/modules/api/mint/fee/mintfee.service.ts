/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintFee} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintFee} from './mintfee.model';

@Injectable()
export class MintfeeService {
	private readonly logger = new Logger(MintfeeService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintFees(tag: string, limit?: number): Promise<OrchardMintFee[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_fees: CashuMintFee[] = await this.cashuMintDatabaseService.getMintFees(client, limit);
				return cashu_fees.map((cf) => new OrchardMintFee(cf));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}
