/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Int } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintProofState } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintProofService } from "./mintproof.service";
import { OrchardMintProof, OrchardMintProofGroup } from "./mintproof.model";

@Resolver()
export class MintProofResolver {

	private readonly logger = new Logger(MintProofResolver.name);

	constructor(
		private mintProofService: MintProofService,
	) {}

	@Query(() => [OrchardMintProof])
	async mint_proofs() : Promise<OrchardMintProof[]> {
		this.logger.debug('GET { mint_proofs }');
		return await this.mintProofService.getMintProofs();
  	}

	@Query(() => [OrchardMintProofGroup])
	async mint_proof_groups(
		@Args('id_keysets', { type: () => [String], nullable: true }) id_keysets?: string[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
        @Args('states', { type: () => [MintProofState], nullable: true }) states?: MintProofState[],
        @Args('page', { type: () => Int, nullable: true }) page?: number,
        @Args('page_size', { type: () => Int, nullable: true }) page_size?: number,
	) : Promise<OrchardMintProofGroup[]> {
		this.logger.debug('GET { mint_proof_groups }');
		return await this.mintProofService.getMintProofGroups({ id_keysets, date_start, date_end, states, page, page_size });
  	}
}
