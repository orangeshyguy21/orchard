/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation } from "@nestjs/graphql";
/* Local Dependencies */
import { MintDatabaseService } from "./mintdatabase.service";
import { OrchardMintDatabase, OrchardMintDatabaseBackup } from "./mintdatabase.model";

@Resolver()
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

	@Mutation(() => OrchardMintDatabaseBackup)
	async mint_database_backup() : Promise<OrchardMintDatabaseBackup> {
		this.logger.debug('POST { mint_database_backup }');
		return await this.mintDatabaseService.createMintDatabaseBackup();
	}
}