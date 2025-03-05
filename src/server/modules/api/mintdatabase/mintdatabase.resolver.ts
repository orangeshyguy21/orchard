/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
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
		try {
			this.logger.debug('GET { mint_databases }');
			return this.mintDatabaseService.getMintDatabases();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}