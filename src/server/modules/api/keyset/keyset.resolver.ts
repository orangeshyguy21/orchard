/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { KeysetService } from "./keyset.service";
import { Keyset } from "./keyset.model";

@Resolver(() => [Keyset])
export class KeysetResolver {
  constructor(
    private keysetService: KeysetService,
  ) {}

  @Query(() => [Keyset])
  async keysets() : Promise<Keyset[]> {
    return this.keysetService.getKeysets();
  }
}
