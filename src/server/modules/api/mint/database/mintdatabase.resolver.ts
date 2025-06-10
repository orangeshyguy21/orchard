/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Mutation, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { Base64 } from '@server/modules/graphql/scalars/base64.scalar';
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
		const tag = 'POST { mint_database_backup }';
		this.logger.debug(tag);
		return await this.mintDatabaseService.createMintDatabaseBackup(tag);
	}

	@Mutation(() => OrchardMintDatabaseRestore)
	async mint_database_restore(
		@Args('filebase64', { type: () => Base64 }) filebase64: string,
	) : Promise<OrchardMintDatabaseRestore> {
		const tag = 'POST { mint_database_restore }';
		this.logger.debug(tag);
		return await this.mintDatabaseService.restoreMintDatabaseBackup(tag, filebase64);
	}
}