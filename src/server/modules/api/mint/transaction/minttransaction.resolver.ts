/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Int } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintProofState } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintTransactionService } from "./minttransaction.service";
import { OrchardMintTransaction } from "./minttransaction.model";

@Resolver(() => [OrchardMintTransaction])
export class MintTransactionResolver {

	private readonly logger = new Logger(MintTransactionResolver.name);

	constructor(
		private mintTransactionService: MintTransactionService,
	) {}

	@Query(() => [OrchardMintTransaction])
	async mint_transactions(
		@Args('id_keysets', { type: () => [String], nullable: true }) id_keysets?: string[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
        @Args('states', { type: () => [MintProofState], nullable: true }) states?: MintProofState[],
        @Args('page', { type: () => Int, nullable: true }) page?: number,
        @Args('page_size', { type: () => Int, nullable: true }) page_size?: number,
	) : Promise<OrchardMintTransaction[]> {
		this.logger.debug('GET { mint_transactions }');
		return await this.mintTransactionService.getMintTransactions({ id_keysets, states, date_start, date_end, page, page_size });
  	}
}