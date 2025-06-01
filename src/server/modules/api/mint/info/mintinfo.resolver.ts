/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { 
	OrchardMintInfo, 
	OrchardMintInfoRpc, 
	OrchardMintNameUpdate, 
	OrchardMintIconUpdate, 
	OrchardMintDescriptionUpdate, 
	OrchardMintMotdUpdate,
	OrchardMintUrlUpdate,
	OrchardMintContactUpdate,
} from "./mintinfo.model";
import { 
	MintNameUpdateInput,
	MintIconUpdateInput,
	MintDescriptionUpdateInput,
	MintMotdUpdateInput,
	MintUrlUpdateInput,
	MintContactUpdateInput,
} from "./mintinfo.input";


@Resolver()
export class MintInfoResolver {

	private readonly logger = new Logger(MintInfoResolver.name);

	constructor(
		private mintInfoService: MintInfoService,
	) {}

	@Query(() => OrchardMintInfo)
	async mint_info() : Promise<OrchardMintInfo> {
		this.logger.debug('GET { mint_info }');
		return await this.mintInfoService.getMintInfo();
	}

	@Query(() => OrchardMintInfoRpc)
	async mint_info_rpc() : Promise<OrchardMintInfoRpc> {
		this.logger.debug('GET { mint_info_rpc }');
		return await this.mintInfoService.getMintInfoRpc();
	}
	
	@Mutation(() => OrchardMintNameUpdate)
	async mint_name_update(@Args('mint_name_update') mint_name_update: MintNameUpdateInput): Promise<OrchardMintNameUpdate> {
		this.logger.debug(`MUTATION { mint_name_update }`);
		return await this.mintInfoService.updateMintName(mint_name_update);
	}

	@Mutation(() => OrchardMintIconUpdate)
	async mint_icon_update(@Args('mint_icon_update') mint_icon_update: MintIconUpdateInput): Promise<OrchardMintIconUpdate> {
		this.logger.debug(`MUTATION { mint_icon_update }`);
		return await this.mintInfoService.updateMintIcon(mint_icon_update);
	}

	@Mutation(() => OrchardMintDescriptionUpdate)
	async mint_short_description_update(@Args('mint_desc_update') mint_desc_update: MintDescriptionUpdateInput): Promise<OrchardMintDescriptionUpdate> {
		this.logger.debug(`MUTATION { mint_short_description_update }`);
		return await this.mintInfoService.updateMintShortDescription(mint_desc_update);
	}

	@Mutation(() => OrchardMintDescriptionUpdate)
	async mint_long_description_update(@Args('mint_desc_update') mint_desc_update: MintDescriptionUpdateInput): Promise<OrchardMintDescriptionUpdate> {
		this.logger.debug(`MUTATION { mint_long_description_update }`);
		return await this.mintInfoService.updateMintLongDescription(mint_desc_update);
	}

	@Mutation(() => OrchardMintMotdUpdate)
	async mint_motd_update(@Args('mint_motd_update') mint_motd_update: MintMotdUpdateInput): Promise<OrchardMintMotdUpdate> {
		this.logger.debug(`MUTATION { mint_motd_update }`);
		return await this.mintInfoService.updateMintMotd(mint_motd_update);
	}

	@Mutation(() => OrchardMintUrlUpdate)
	async mint_url_add(@Args('mint_url_update') mint_url_update: MintUrlUpdateInput): Promise<OrchardMintUrlUpdate> {
		this.logger.debug(`MUTATION { mint_url_add }`);
		return await this.mintInfoService.addMintUrl(mint_url_update);
	}

	@Mutation(() => OrchardMintUrlUpdate)
	async mint_url_remove(@Args('mint_url_update') mint_url_update: MintUrlUpdateInput): Promise<OrchardMintUrlUpdate> {
		this.logger.debug(`MUTATION { mint_url_remove }`);
		return await this.mintInfoService.removeMintUrl(mint_url_update);
	}

	@Mutation(() => OrchardMintContactUpdate)
	async mint_contact_add(@Args('mint_contact_update') mint_contact_update: MintContactUpdateInput): Promise<OrchardMintContactUpdate> {
		this.logger.debug(`MUTATION { mint_contact_add }`);
		return await this.mintInfoService.addMintContact(mint_contact_update);
	}

	@Mutation(() => OrchardMintContactUpdate)
	async mint_contact_remove(@Args('mint_contact_update') mint_contact_update: MintContactUpdateInput): Promise<OrchardMintContactUpdate> {
		this.logger.debug(`MUTATION { mint_contact_remove }`);
		return await this.mintInfoService.removeMintContact(mint_contact_update);
	}
}