/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import { GraphQLError } from 'graphql';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintKeyset } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintKeyset } from './mintkeyset.model';

@Injectable()
export class MintKeysetService {

	private readonly logger = new Logger(MintKeysetService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintKeysets() : Promise<OrchardMintKeyset[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_keysets : CashuMintKeyset[] = await this.cashuMintDatabaseService.getMintKeysets(db);
				return cashu_keysets.map( ck => new OrchardMintKeyset(ck));
			} catch (error) {
				this.logger.error('Error getting mint keysets from database');
				this.logger.debug(`Error getting mint keysets from database: ${error}`);
				throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
			}
		});
	}
}