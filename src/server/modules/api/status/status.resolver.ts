/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
/* Local Dependencies */
import { StatusService } from "./status.service";
import { OrchardStatus } from "./status.model";


@Resolver(() => OrchardStatus)
export class StatusResolver {
  constructor(
    private statusService: StatusService,
  ) {}

  @Query(() => OrchardStatus)
  status() : OrchardStatus {
    return this.statusService.getStatus();
  }
}
