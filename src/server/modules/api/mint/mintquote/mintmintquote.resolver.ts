/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args, Mutation, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MintQuoteState} from '@server/modules/cashu/cashu.enums';
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {MintMintQuoteService} from './mintmintquote.service';
import {OrchardMintMintQuote} from './mintmintquote.model';
import {MintNut04UpdateInput, MintNut04QuoteUpdateInput, MintNut04AdminIssueInput} from './mintmintquote.input';
import {OrchardMintNut04Update, OrchardMintNut04QuoteUpdate, OrchardMintNut04AdminIssue} from './mintmintquote.model';

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
	@Mutation(() => OrchardMintNut04Update)
	async mint_nut04_update(@Args('mint_nut04_update') mint_nut04_update: MintNut04UpdateInput): Promise<OrchardMintNut04Update> {
		const tag = 'MUTATION { mint_nut04_update }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.updateMintNut04(tag, mint_nut04_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintNut04QuoteUpdate)
	async mint_nut04_quote_update(
		@Args('mint_nut04_quote_update') mint_nut04_quote_update: MintNut04QuoteUpdateInput,
	): Promise<OrchardMintNut04QuoteUpdate> {
		const tag = 'MUTATION { mint_nut04_quote_update }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.updateMintNut04Quote(tag, mint_nut04_quote_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintNut04AdminIssue)
	async mint_nut04_admin_issue(
		@Args('mint_nut04_admin_issue') mint_nut04_admin_issue: MintNut04AdminIssueInput,
	): Promise<OrchardMintNut04AdminIssue> {
		const tag = 'MUTATION { mint_nut04_admin_issue }';
		this.logger.debug(tag);
		return await this.mintMintQuoteService.adminIssueMintNut04Quote(tag, mint_nut04_admin_issue);
	}
}
