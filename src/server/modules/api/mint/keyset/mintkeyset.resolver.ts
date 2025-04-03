/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";

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
}
