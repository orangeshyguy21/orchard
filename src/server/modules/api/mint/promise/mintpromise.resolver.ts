/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {MintPromiseService} from './mintpromise.service';
import {OrchardMintPromiseGroup} from './mintpromise.model';

@Resolver(() => [OrchardMintPromiseGroup])
export class MintPromiseResolver {
	private readonly logger = new Logger(MintPromiseResolver.name);

	constructor(private mintPromiseService: MintPromiseService) {}

	@Query(() => [OrchardMintPromiseGroup])
	async mint_promise_groups(
		@Args('id_keysets', {type: () => [String], nullable: true}) id_keysets?: string[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('page', {type: () => Int, nullable: true}) page?: number,
		@Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
	): Promise<OrchardMintPromiseGroup[]> {
		const tag = 'GET { mint_promise_groups }';
		this.logger.debug(tag);
		return await this.mintPromiseService.getMintPromiseGroups(tag, {id_keysets, date_start, date_end, units, page, page_size});
	}
}
