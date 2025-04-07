/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { OrchardMintInfo, OrchardMintInfoRpc } from "./mintinfo.model";

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
	
	// @Mutation(() => Boolean)
	// async update_mint_name(@Args('name') name: string): Promise<boolean> {
	// 	this.logger.debug(`MUTATION { update_mint_name } with name: ${name}`);
	// 	return await this.mintInfoService.mutateMintName(name);
	// }
}




// @Mutation(() => Post)
// async upvotePost(
//   @Args('upvotePostData') upvotePostData: UpvotePostInput,
// ) {}
