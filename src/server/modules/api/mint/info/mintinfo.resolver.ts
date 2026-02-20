/* Core Dependencies */
import {Logger, UseInterceptors} from '@nestjs/common';
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
import {LogChange} from '@server/modules/change/change.decorator';
import {ChangeAction} from '@server/modules/change/change.enums';
/* Local Dependencies */
import {MintInfoService} from './mintinfo.service';
import {MintInfoInterceptor} from './mintinfo.interceptor';
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
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
        action: ChangeAction.UPDATE,
		field: 'name',
		arg_keys: ['name'],
		old_value_key: 'name',
	})
	@Mutation(() => OrchardMintNameUpdate)
	async mint_name_update(
		@Args('name', {nullable: true}) name: string,
	): Promise<OrchardMintNameUpdate> {
		const tag = 'MUTATION { mint_name_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintName(tag, name);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.UPDATE,
		field: 'icon_url',
		arg_keys: ['icon_url'],
		old_value_key: 'icon_url',
	})
	@Mutation(() => OrchardMintIconUpdate)
	async mint_icon_update(
		@Args('icon_url') icon_url: string,
	): Promise<OrchardMintIconUpdate> {
		const tag = 'MUTATION { mint_icon_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintIcon(tag, icon_url);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.UPDATE,
		field: 'description',
		arg_keys: ['description'],
		old_value_key: 'description',
	})
	@Mutation(() => OrchardMintDescriptionUpdate)
	async mint_short_description_update(
		@Args('description') description: string,
	): Promise<OrchardMintDescriptionUpdate> {
		const tag = 'MUTATION { mint_short_description_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintShortDescription(tag, description);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.UPDATE,
		field: 'description_long',
		arg_keys: ['description'],
		old_value_key: 'description_long',
	})
	@Mutation(() => OrchardMintDescriptionUpdate)
	async mint_long_description_update(
		@Args('description') description: string,
	): Promise<OrchardMintDescriptionUpdate> {
		const tag = 'MUTATION { mint_long_description_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintLongDescription(tag, description);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.UPDATE,
		field: 'motd',
		arg_keys: ['motd'],
		old_value_key: 'motd',
	})
	@Mutation(() => OrchardMintMotdUpdate)
	async mint_motd_update(
		@Args('motd', {nullable: true}) motd: string,
	): Promise<OrchardMintMotdUpdate> {
		const tag = 'MUTATION { mint_motd_update }';
		this.logger.debug(tag);
		return await this.mintInfoService.updateMintMotd(tag, motd);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.CREATE,
		field: 'url',
		arg_keys: ['url'],
	})
	@Mutation(() => OrchardMintUrlUpdate)
	async mint_url_add(
		@Args('url') url: string,
	): Promise<OrchardMintUrlUpdate> {
		const tag = 'MUTATION { mint_url_add }';
		this.logger.debug(tag);
		return await this.mintInfoService.addMintUrl(tag, url);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.DELETE,
		field: 'url',
		arg_keys: ['url'],
	})
	@Mutation(() => OrchardMintUrlUpdate)
	async mint_url_remove(
		@Args('url') url: string,
	): Promise<OrchardMintUrlUpdate> {
		const tag = 'MUTATION { mint_url_remove }';
		this.logger.debug(tag);
		return await this.mintInfoService.removeMintUrl(tag, url);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.CREATE,
		field: 'contact',
		arg_keys: ['method', 'info'],
	})
	@Mutation(() => OrchardMintContactUpdate)
	async mint_contact_add(
		@Args('method') method: string,
		@Args('info') info: string,
	): Promise<OrchardMintContactUpdate> {
		const tag = 'MUTATION { mint_contact_add }';
		this.logger.debug(tag);
		return await this.mintInfoService.addMintContact(tag, method, info);
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@UseInterceptors(MintInfoInterceptor)
	@LogChange({
		action: ChangeAction.DELETE,
		field: 'contact',
		arg_keys: ['method', 'info'],
	})
	@Mutation(() => OrchardMintContactUpdate)
	async mint_contact_remove(
		@Args('method') method: string,
		@Args('info') info: string,
	): Promise<OrchardMintContactUpdate> {
		const tag = 'MUTATION { mint_contact_remove }';
		this.logger.debug(tag);
		return await this.mintInfoService.removeMintContact(tag, method, info);
	}
}
