/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {MintSwapService} from './mintswap.service';
import {OrchardMintSwap} from './mintswap.model';

@Resolver()
export class MintSwapResolver {
	private readonly logger = new Logger(MintSwapResolver.name);

	constructor(private mintSwapService: MintSwapService) {}

	@Query(() => [OrchardMintSwap])
	async mint_swaps(
		@Args('id_keysets', {type: () => [String], nullable: true}) id_keysets?: string[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('page', {type: () => Int, nullable: true}) page?: number,
		@Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
	): Promise<OrchardMintSwap[]> {
		const tag = 'GET { mint_swaps }';
		this.logger.debug(tag);
		return await this.mintSwapService.getMintSwaps(tag, {id_keysets, date_start, date_end, units, page, page_size});
	}
}
