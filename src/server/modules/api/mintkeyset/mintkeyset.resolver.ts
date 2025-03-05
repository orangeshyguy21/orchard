/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";

@Resolver(() => [OrchardMintKeyset])
export class MintKeysetResolver {

	private readonly logger = new Logger(MintKeysetResolver.name);

	constructor(
		private mintKeysetService: MintKeysetService,
  	) {}

	@Query(() => [OrchardMintKeyset])
	async mint_keysets() : Promise<OrchardMintKeyset[]> {
		try {
			this.logger.debug('GET { mint_keysets }');
			return this.mintKeysetService.getMintKeysets();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}
