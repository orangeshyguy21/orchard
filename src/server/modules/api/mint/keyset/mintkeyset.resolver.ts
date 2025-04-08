/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";
import { RotateNextKeysetOutput } from "./mintkeyset.model";
import { RotateNextKeysetInput } from "./mintkeyset.input";

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

	@Mutation(() => RotateNextKeysetOutput)
	async rotate_next_keyset(@Args('rotateNextKeysetInput') rotateNextKeysetInput: RotateNextKeysetInput): Promise<RotateNextKeysetOutput> {
		this.logger.debug(`MUTATION { rotate_next_keyset }`);
		return await this.mintKeysetService.rotateNextKeyset(rotateNextKeysetInput);
	}
}
