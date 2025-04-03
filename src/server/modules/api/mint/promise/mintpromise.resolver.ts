/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
/* Local Dependencies */
import { MintPromiseService } from "./mintpromise.service";
import { OrchardMintPromise } from "./mintpromise.model";


@Resolver(() => [OrchardMintPromise])
export class MintPromiseResolver {

	private readonly logger = new Logger(MintPromiseResolver.name);

	constructor(
		private mintPromiseService: MintPromiseService,
	) {}

	@Query(() => [OrchardMintPromise])
	async mint_promises(
		@Args('id_keysets', { type: () => [String], nullable: true }) id_keysets?: string[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
	) : Promise<OrchardMintPromise[]> {
		this.logger.debug('GET { mint_promises }');
		return await this.mintPromiseService.getMintPromises({ id_keysets, date_start, date_end });
	}
}
