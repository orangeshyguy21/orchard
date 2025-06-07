/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintDatabaseService } from "./mintdatabase.service";
import { OrchardMintDatabaseBackup, OrchardMintDatabaseRestore } from "./mintdatabase.model";

@Resolver()
export class MintDatabaseResolver {

	private readonly logger = new Logger(MintDatabaseResolver.name);

	constructor(
		private mintDatabaseService: MintDatabaseService,
	) {}

	@Mutation(() => OrchardMintDatabaseBackup)
	async mint_database_backup() : Promise<OrchardMintDatabaseBackup> {
		this.logger.debug('POST { mint_database_backup }');
		return await this.mintDatabaseService.createMintDatabaseBackup();
	}

	@Mutation(() => OrchardMintDatabaseRestore)
	async mint_database_restore(
		@Args('filebase64') filebase64: string,
	) : Promise<OrchardMintDatabaseRestore> {
		this.logger.debug('POST { mint_database_restore }');
		return await this.mintDatabaseService.restoreMintDatabaseBackup(filebase64);
	}
}