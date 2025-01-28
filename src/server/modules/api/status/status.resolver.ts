/* Core Dependencies */
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { StatusService } from "./status.service";
import { Status } from "./status.model";


@Resolver(() => Status)
export class StatusResolver {
  constructor(
    private statusService: StatusService,
  ) {}

  @Query(() => Status)
  status() : Status {
    return this.statusService.getStatus();
  }
}
