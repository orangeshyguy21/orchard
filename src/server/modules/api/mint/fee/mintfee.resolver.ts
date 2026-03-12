/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {Int} from '@nestjs/graphql';
/* Internal Dependencies */
import {OrchardMintFee} from './mintfee.model';
import {MintfeeService} from './mintfee.service';

@Resolver()
export class MintFeeResolver {
	private readonly logger = new Logger(MintFeeResolver.name);

	constructor(private mintFeeService: MintfeeService) {}

	@Query(() => [OrchardMintFee], {description: 'Get mint fee snapshots'})
	async mint_fees(
		@Args('limit', {type: () => Int, nullable: true, description: 'Maximum number of fee snapshots to return'}) limit?: number,
	): Promise<OrchardMintFee[]> {
		const tag = 'GET { mint_fees }';
		this.logger.debug(tag);
		return await this.mintFeeService.getMintFees(tag, limit);
	}
}
