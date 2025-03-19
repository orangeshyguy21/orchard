/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import { GraphQLError } from 'graphql';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintDatabaseVersion } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintDatabase } from './mintdatabase.model';

@Injectable()
export class MintDatabaseService {

	private readonly logger = new Logger(MintDatabaseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintDatabases() : Promise<OrchardMintDatabase[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_databases : CashuMintDatabaseVersion[] = await this.cashuMintDatabaseService.getMintDatabaseVersions(db);
				return cashu_databases.map( cd => new OrchardMintDatabase(cd));
			} catch (error) {
				this.logger.error('Error getting mint db versions from database');
				this.logger.debug(`Error getting mint db versions from database: ${error}`);
				throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
			}
		});
	}
}