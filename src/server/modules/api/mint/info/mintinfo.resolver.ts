/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { 
	OrchardMintInfo, 
	OrchardMintInfoRpc, 
	UpdateMintNameOutput, 
	UpdateMintIconOutput, 
	UpdateMintDescriptionOutput, 
	UpdateMintMotdOutput,
	UpdateMintUrlOutput,
	UpdateContactOutput,
} from "./mintinfo.model";
import { 
	UpdateMintNameInput,
	UpdateMintIconInput,
	UpdateMintDescriptionInput,
	UpdateMotdInput,
	UpdateUrlInput,
	UpdateContactInput,
} from "./mintinfo.input";


@Resolver(() => [OrchardMintInfo])
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
	
	@Mutation(() => UpdateMintNameOutput)
	async update_mint_name(@Args('updateMintNameInput') updateMintNameInput: UpdateMintNameInput): Promise<UpdateMintNameOutput> {
		this.logger.debug(`MUTATION { update_mint_name }`);
		return await this.mintInfoService.updateMintName(updateMintNameInput);
	}

	@Mutation(() => UpdateMintIconOutput)
	async update_mint_icon(@Args('updateMintIconInput') updateMintIconInput: UpdateMintIconInput): Promise<UpdateMintIconOutput> {
		this.logger.debug(`MUTATION { update_mint_icon }`);
		return await this.mintInfoService.updateMintIcon(updateMintIconInput);
	}

	@Mutation(() => UpdateMintDescriptionOutput)
	async update_mint_short_description(@Args('updateMintDescriptionInput') updateMintDescriptionInput: UpdateMintDescriptionInput): Promise<UpdateMintDescriptionOutput> {
		this.logger.debug(`MUTATION { update_mint_short_description }`);
		return await this.mintInfoService.updateMintShortDescription(updateMintDescriptionInput);
	}

	@Mutation(() => UpdateMintDescriptionOutput)
	async update_mint_long_description(@Args('updateMintDescriptionInput') updateMintDescriptionInput: UpdateMintDescriptionInput): Promise<UpdateMintDescriptionOutput> {
		this.logger.debug(`MUTATION { update_mint_long_description }`);
		return await this.mintInfoService.updateMintLongDescription(updateMintDescriptionInput);
	}

	@Mutation(() => UpdateMintMotdOutput)
	async update_mint_motd(@Args('updateMotdInput') updateMotdInput: UpdateMotdInput): Promise<UpdateMintMotdOutput> {
		this.logger.debug(`MUTATION { update_mint_motd }`);
		return await this.mintInfoService.updateMintMotd(updateMotdInput);
	}

	@Mutation(() => UpdateMintUrlOutput)
	async add_mint_url(@Args('updateUrlInput') updateUrlInput: UpdateUrlInput): Promise<UpdateMintUrlOutput> {
		this.logger.debug(`MUTATION { add_mint_url }`);
		return await this.mintInfoService.addMintUrl(updateUrlInput);
	}

	@Mutation(() => UpdateMintUrlOutput)
	async remove_mint_url(@Args('updateUrlInput') updateUrlInput: UpdateUrlInput): Promise<UpdateMintUrlOutput> {
		this.logger.debug(`MUTATION { remove_mint_url }`);
		return await this.mintInfoService.removeMintUrl(updateUrlInput);
	}

	@Mutation(() => UpdateContactOutput)
	async add_mint_contact(@Args('updateContactInput') updateContactInput: UpdateContactInput): Promise<UpdateContactOutput> {
		this.logger.debug(`MUTATION { add_mint_contact }`);
		return await this.mintInfoService.addMintContact(updateContactInput);
	}

	@Mutation(() => UpdateContactOutput)
	async remove_mint_contact(@Args('updateContactInput') updateContactInput: UpdateContactInput): Promise<UpdateContactOutput> {
		this.logger.debug(`MUTATION { remove_mint_contact }`);
		return await this.mintInfoService.removeMintContact(updateContactInput);
	}
}