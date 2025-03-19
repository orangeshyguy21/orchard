/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintProofService } from "./mintproof.service";
import { OrchardMintProof } from "./mintproof.model";

@Resolver(() => [OrchardMintProof])
export class MintProofResolver {

	private readonly logger = new Logger(MintProofResolver.name);

	constructor(
		private mintProofService: MintProofService,
	) {}

	@Query(() => [OrchardMintProof])
	async mint_proofs_pending() : Promise<OrchardMintProof[]> {
		try {
			this.logger.debug('GET { mint_proofs_pending }');
			return await this.mintProofService.getMintProofsPending();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
  	}

	@Query(() => [OrchardMintProof])
	async mint_proofs_used() : Promise<OrchardMintProof[]> {
		try {
			this.logger.debug('GET { mint_proofs_used }');
			return await this.mintProofService.getMintProofsUsed();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		}
	}
}
