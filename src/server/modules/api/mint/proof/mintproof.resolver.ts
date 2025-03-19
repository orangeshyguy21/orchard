/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
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
		this.logger.debug('GET { mint_proofs_pending }');
		return await this.mintProofService.getMintProofsPending();
  	}

	@Query(() => [OrchardMintProof])
	async mint_proofs_used() : Promise<OrchardMintProof[]> {
		this.logger.debug('GET { mint_proofs_used }');
		return await this.mintProofService.getMintProofsUsed();
	}
}
