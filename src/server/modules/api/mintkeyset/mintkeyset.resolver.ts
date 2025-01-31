/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { OrchardMintKeyset } from "./mintkeyset.model";

@Resolver(() => [OrchardMintKeyset])
export class MintKeysetResolver {
  constructor(
    private mintKeysetService: MintKeysetService,
  ) {}

  @Query(() => [OrchardMintKeyset])
  async mint_keysets() : Promise<OrchardMintKeyset[]> {
    return this.mintKeysetService.getMintKeysets();
  }
}
