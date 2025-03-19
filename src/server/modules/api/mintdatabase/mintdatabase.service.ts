/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintDatabaseVersion } from '@server/modules/cashu/mintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintDatabase } from './mintdatabase.model';

@Injectable()
export class MintDatabaseService {

	private readonly logger = new Logger(MintDatabaseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintDatabases() : Promise<OrchardMintDatabase[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_databases : CashuMintDatabaseVersion[] = await this.cashuMintDatabaseService.getMintDatabaseVersions(db);
			return cashu_databases.map( cd => new OrchardMintDatabase(cd));
		} catch (error) {
			this.logger.error('Error getting mint db versions from database', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}