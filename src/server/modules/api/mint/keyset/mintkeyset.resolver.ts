/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";
import { OrchardMintKeysetRotation } from "./mintkeyset.model";
import { MintRotateKeysetInput } from "./mintkeyset.input";

@Resolver()
export class MintKeysetResolver {

	private readonly logger = new Logger(MintKeysetResolver.name);

	constructor(
		private mintKeysetService: MintKeysetService,
  	) {}

	@Query(() => [OrchardMintKeyset])
	@UseGuards(GqlAuthGuard)
	async mint_keysets() : Promise<OrchardMintKeyset[]> {
		const tag = 'GET { mint_keysets }';
		this.logger.debug(tag);
		return await this.mintKeysetService.getMintKeysets(tag);
	}

	@Mutation(() => OrchardMintKeysetRotation)
	@UseGuards(GqlAuthGuard)
	async mint_rotate_keyset(@Args('mint_rotate_keyset') mint_rotate_keyset: MintRotateKeysetInput): Promise<OrchardMintKeysetRotation> {
		const tag = 'MUTATION { mint_rotate_keyset }';
		this.logger.debug(tag);
		return await this.mintKeysetService.mintRotateKeyset(tag, mint_rotate_keyset);
	}
}
