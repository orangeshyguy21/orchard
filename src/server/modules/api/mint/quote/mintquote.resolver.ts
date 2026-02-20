/* Core Dependencies */
import {Logger, UseInterceptors} from '@nestjs/common';
import {Resolver, Query, Args, Mutation} from '@nestjs/graphql';
/* Application Dependencies */
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
import {LogChange} from '@server/modules/change/change.decorator';
import {ChangeAction} from '@server/modules/change/change.enums';
/* Local Dependencies */
import {MintQuoteService} from './mintquote.service';
import {MintQuoteInterceptor} from './mintquote.interceptor';
import {OrchardMintQuoteTtls} from './mintquote.model';
import {MintQuoteTtlUpdateInput} from './mintquote.input';

@Resolver(() => [OrchardMintQuoteTtls])
export class MintQuoteResolver {
	private readonly logger = new Logger(MintQuoteResolver.name);

	constructor(private mintQuoteService: MintQuoteService) {}

	@Query(() => OrchardMintQuoteTtls)
	async mint_quote_ttl(): Promise<OrchardMintQuoteTtls> {
		const tag = 'GET { mint_quote_ttl }';
		this.logger.debug(tag);
		return await this.mintQuoteService.getMintQuoteTtl(tag);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintQuoteInterceptor)
	@LogChange({
		action: ChangeAction.UPDATE,
		field: 'quote_ttl',
	})
	@Mutation(() => OrchardMintQuoteTtls)
	async mint_quote_ttl_update(
		@Args('mint_quote_ttl_update') mint_quote_ttl_update: MintQuoteTtlUpdateInput,
	): Promise<OrchardMintQuoteTtls> {
		const tag = 'MUTATION { mint_quote_ttl_update }';
		this.logger.debug(tag);
		return await this.mintQuoteService.updateMintQuoteTtl(tag, mint_quote_ttl_update);
	}
}
