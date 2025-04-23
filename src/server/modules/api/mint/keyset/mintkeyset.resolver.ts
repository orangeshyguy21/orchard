/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";
import { MintRotateKeysetOutput } from "./mintkeyset.model";
import { MintRotateKeysetInput } from "./mintkeyset.input";

@Resolver(() => [OrchardMintKeyset])
export class MintKeysetResolver {

	private readonly logger = new Logger(MintKeysetResolver.name);

	constructor(
		private mintKeysetService: MintKeysetService,
  	) {}

	@Query(() => [OrchardMintKeyset])
	async mint_keysets() : Promise<OrchardMintKeyset[]> {
		this.logger.debug('GET { mint_keysets }');
		return await this.mintKeysetService.getMintKeysets();
	}

	@Mutation(() => MintRotateKeysetOutput)
	async mint_rotate_keyset(@Args('mint_rotate_keyset') mint_rotate_keyset: MintRotateKeysetInput): Promise<MintRotateKeysetOutput> {
		this.logger.debug(`MUTATION { mint_rotate_keyset }`);
		return await this.mintKeysetService.mintRotateKeyset(mint_rotate_keyset);
	}
}
