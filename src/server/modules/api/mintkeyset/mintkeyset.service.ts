/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintKeyset } from '@server/modules/cashu/mintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintKeyset } from './mintkeyset.model';

@Injectable()
export class MintKeysetService {

	private readonly logger = new Logger(MintKeysetService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintKeysets() : Promise<OrchardMintKeyset[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_keysets : CashuMintKeyset[] = await this.cashuMintDatabaseService.getMintKeysets(db);
			return cashu_keysets.map( ck => new OrchardMintKeyset(ck));
		} catch (error) {
			this.logger.error('Error getting keysets from mint database', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}