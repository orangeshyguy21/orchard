/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {MintInfoService} from './mintinfo.service';
import {
	OrchardMintInfo,
	OrchardMintInfoRpc,
	OrchardMintNameUpdate,
	OrchardMintIconUpdate,
	OrchardMintDescriptionUpdate,
	OrchardMintMotdUpdate,
	OrchardMintUrlUpdate,
	OrchardMintContactUpdate,
} from './mintinfo.model';
import {
	MintNameUpdateInput,
	MintIconUpdateInput,
	MintDescriptionUpdateInput,
	MintMotdUpdateInput,
	MintUrlUpdateInput,
	MintContactUpdateInput,
} from './mintinfo.input';

@Resolver()
export class MintInfoResolver {
	private readonly logger = new Logger(MintInfoResolver.name);

	constructor(private mintInfoService: MintInfoService) {}

	@Query(() => OrchardMintInfo)
	async mint_info(): Promise<OrchardMintInfo> {
		const tag = 'GET { mint_info }';
		this.logger.debug(tag);
		return await this.mintInfoService.getMintInfo(tag);
	}

	@Query(() => OrchardMintInfoRpc)
	async mint_info_rpc(): Promise<OrchardMintInfoRpc> {
		const tag = 'GET { mint_info_rpc }';
		this.logger.debug(tag);
		return await this.mintInfoService.getMintInfoRpc(tag);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintNameUpdate)
	async mint_name_update(@Args('mint_name_update') mint_name_update: MintNameUpdateInput): Promise<OrchardMintNameUpdate> {
		const tag = 'MUTATION { mint_name_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintName(tag, mint_name_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintIconUpdate)
	async mint_icon_update(@Args('mint_icon_update') mint_icon_update: MintIconUpdateInput): Promise<OrchardMintIconUpdate> {
		const tag = 'MUTATION { mint_icon_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintIcon(tag, mint_icon_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintDescriptionUpdate)
	async mint_short_description_update(
		@Args('mint_desc_update') mint_desc_update: MintDescriptionUpdateInput,
	): Promise<OrchardMintDescriptionUpdate> {
		const tag = 'MUTATION { mint_short_description_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintShortDescription(tag, mint_desc_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintDescriptionUpdate)
	async mint_long_description_update(
		@Args('mint_desc_update') mint_desc_update: MintDescriptionUpdateInput,
	): Promise<OrchardMintDescriptionUpdate> {
		const tag = 'MUTATION { mint_long_description_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintLongDescription(tag, mint_desc_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintMotdUpdate)
	async mint_motd_update(@Args('mint_motd_update') mint_motd_update: MintMotdUpdateInput): Promise<OrchardMintMotdUpdate> {
		const tag = 'MUTATION { mint_motd_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintMotd(tag, mint_motd_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintUrlUpdate)
	async mint_url_add(@Args('mint_url_update') mint_url_update: MintUrlUpdateInput): Promise<OrchardMintUrlUpdate> {
		const tag = 'MUTATION { mint_url_add }';
		this.logger.debug(tag);
		return await this.mintInfoService.addMintUrl(tag, mint_url_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintUrlUpdate)
	async mint_url_remove(@Args('mint_url_update') mint_url_update: MintUrlUpdateInput): Promise<OrchardMintUrlUpdate> {
		const tag = 'MUTATION { mint_url_remove }';
		this.logger.debug(tag);
		return await this.mintInfoService.removeMintUrl(tag, mint_url_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintContactUpdate)
	async mint_contact_add(@Args('mint_contact_update') mint_contact_update: MintContactUpdateInput): Promise<OrchardMintContactUpdate> {
		const tag = 'MUTATION { mint_contact_add }';
		this.logger.debug(tag);
		return await this.mintInfoService.addMintContact(tag, mint_contact_update);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardMintContactUpdate)
	async mint_contact_remove(@Args('mint_contact_update') mint_contact_update: MintContactUpdateInput): Promise<OrchardMintContactUpdate> {
		const tag = 'MUTATION { mint_contact_remove }';
		this.logger.debug(tag);
		return await this.mintInfoService.removeMintContact(tag, mint_contact_update);
	}
}
