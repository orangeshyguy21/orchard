/* Core Dependencies */
import {Logger, UseInterceptors} from '@nestjs/common';
import {Resolver, Query, Args, Mutation, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MintQuoteState} from '@server/modules/cashu/cashu.enums';
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
import {LogEvent} from '@server/modules/event/event.decorator';
import {EventLogType} from '@server/modules/event/event.enums';
/* Local Dependencies */
import {MintMintQuoteService} from './mintmintquote.service';
import {MintMintQuoteInterceptor} from './mintmintquote.interceptor';
import {OrchardMintMintQuote} from './mintmintquote.model';
import {OrchardMintNut04Update, OrchardMintNut04QuoteUpdate} from './mintmintquote.model';

@Resolver()
export class MintMintQuoteResolver {
	private readonly logger = new Logger(MintMintQuoteResolver.name);

	constructor(private mintMintQuoteService: MintMintQuoteService) {}

	@Query(() => [OrchardMintMintQuote])
	async mint_mint_quotes(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('states', {type: () => [MintQuoteState], nullable: true}) states?: MintQuoteState[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('page', {type: () => Int, nullable: true}) page?: number,
		@Args('page_size', {type: () => Int, nullable: true}) page_size?: number,
	): Promise<OrchardMintMintQuote[]> {
		const tag = 'GET { mint_mint_quotes }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.getMintMintQuotes(tag, {units, states, date_start, date_end, page, page_size});
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintMintQuoteInterceptor)
	@LogEvent({
		type: EventLogType.UPDATE,
		field: 'nut04',
	})
	@Mutation(() => OrchardMintNut04Update)
	async mint_nut04_update(
		@Args('unit') unit: string,
		@Args('method') method: string,
		@Args('disabled', {nullable: true}) disabled: boolean,
		@Args('min_amount', {type: () => Int, nullable: true}) min_amount: number,
		@Args('max_amount', {type: () => Int, nullable: true}) max_amount: number,
		@Args('description', {nullable: true}) description: boolean,
	): Promise<OrchardMintNut04Update> {
		const tag = 'MUTATION { mint_nut04_update }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.updateMintNut04(tag, unit, method, disabled, min_amount, max_amount, description);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintMintQuoteInterceptor)
	@LogEvent({
		type: EventLogType.UPDATE,
		field: 'nut04_quote',
	})
	@Mutation(() => OrchardMintNut04QuoteUpdate)
	async mint_nut04_quote_update(@Args('quote_id') quote_id: string, @Args('state') state: string): Promise<OrchardMintNut04QuoteUpdate> {
		const tag = 'MUTATION { mint_nut04_quote_update }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.updateMintNut04Quote(tag, quote_id, state);
	}
}
