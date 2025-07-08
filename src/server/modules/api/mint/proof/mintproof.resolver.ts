/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Int } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintProofState, MintUnit } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintProofService } from "./mintproof.service";
import { OrchardMintProofGroup, OrchardMintProofGroupStats } from "./mintproof.model";

@Resolver()
export class MintProofResolver {

	private readonly logger = new Logger(MintProofResolver.name);

	constructor(
		private mintProofService: MintProofService,
	) {}

	@Query(() => [OrchardMintProofGroup])
	async mint_proof_groups(
		@Args('id_keysets', { type: () => [String], nullable: true }) id_keysets?: string[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
        @Args('states', { type: () => [MintProofState], nullable: true }) states?: MintProofState[],
        @Args('page', { type: () => Int, nullable: true }) page?: number,
        @Args('page_size', { type: () => Int, nullable: true }) page_size?: number,
	) : Promise<OrchardMintProofGroup[]> {
		const tag = 'GET { mint_proof_groups }';
		this.logger.debug(tag);
		return await this.mintProofService.getMintProofGroups(tag, { id_keysets, date_start, date_end, units, states, page, page_size });
  	}

	@Query(() => OrchardMintProofGroupStats)
	async mint_proof_group_stats(
		@Args('unit', { type: () => MintUnit }) unit: MintUnit,
	) : Promise<OrchardMintProofGroupStats> {
		const tag = 'GET { mint_proof_group_stats }';
		this.logger.debug(tag);
		return await this.mintProofService.getMintProofGroupStats(tag, unit);
	}
}
