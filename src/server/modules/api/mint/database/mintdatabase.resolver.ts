/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Local Dependencies */
import { MintDatabaseService } from "./mintdatabase.service";
import { OrchardMintDatabase } from "./mintdatabase.model";

@Resolver(() => [OrchardMintDatabase])
export class MintDatabaseResolver {

	private readonly logger = new Logger(MintDatabaseResolver.name);

	constructor(
		private mintDatabaseService: MintDatabaseService,
	) {}

	@Query(() => [OrchardMintDatabase])
	async mint_databases() : Promise<OrchardMintDatabase[]> {
		this.logger.debug('GET { mint_databases }');
		return await this.mintDatabaseService.getMintDatabases();
	}
}