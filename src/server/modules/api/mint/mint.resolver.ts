/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { MintService } from "./mint.service";
import { Mint } from "./mint.model";

@Resolver(() => [Mint])
export class MintResolver {
  constructor(
    private mintService: MintService,
  ) {}

  @Query(() => Mint)
  async mint() : Promise<Mint> {
    return this.mintService.getMint();
  }
}
