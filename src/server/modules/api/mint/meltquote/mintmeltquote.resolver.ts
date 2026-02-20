/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MeltQuoteState} from '@server/modules/cashu/cashu.enums';
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {MintMeltQuoteService} from './mintmeltquote.service';
import {OrchardMintMeltQuote} from './mintmeltquote.model';
import {OrchardMintNut05Update, OrchardMintNut05QuoteUpdate} from './mintmeltquote.model';

@Resolver()
export class MintMeltQuoteResolver {
	private readonly logger = new Logger(MintMeltQuoteResolver.name);

	constructor(private mintMeltQuoteService: MintMeltQuoteService) {}

	@Query(() => [OrchardMintMeltQuote])
	async mint_melt_quotes(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('states', {type: () => [MeltQuoteState], nullable: true}) states?: MeltQuoteState[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('page', {type: () => Int, nullable: true}) page?: number,
		@Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
	): Promise<OrchardMintMeltQuote[]> {
		const tag = 'GET { mint_melt_quotes }';
		this.logger.debug(tag);
		return await this.mintMeltQuoteService.getMintMeltQuotes(tag, {units, states, date_start, date_end, page, page_size});
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintNut05Update)
	async mint_nut05_update(
		@Args('unit') unit: string,
		@Args('method') method: string,
		@Args('disabled', {nullable: true}) disabled: boolean,
		@Args('min_amount', {type: () => Int, nullable: true}) min_amount: number,
		@Args('max_amount', {type: () => Int, nullable: true}) max_amount: number,
	): Promise<OrchardMintNut05Update> {
        console.log('mint_nut05_update', unit, method, disabled, min_amount, max_amount);
		const tag = 'MUTATION { mint_nut05_update }';
		this.logger.debug(tag);
		return await this.mintMeltQuoteService.updateMintNut05(tag, unit, method, disabled, min_amount, max_amount);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintNut05QuoteUpdate)
	async mint_nut05_quote_update(
		@Args('quote_id') quote_id: string,
		@Args('state') state: string,
	): Promise<OrchardMintNut05QuoteUpdate> {
		const tag = 'MUTATION { mint_nut05_quote_update }';
		this.logger.debug(tag);
		return await this.mintMeltQuoteService.updateMintNut05Quote(tag, quote_id, state);
	}
}
