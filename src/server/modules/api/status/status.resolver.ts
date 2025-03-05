/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Local Dependencies */
import { StatusService } from "./status.service";
import { OrchardStatus } from "./status.model";

@Resolver(() => OrchardStatus)
export class StatusResolver {

	private readonly logger = new Logger(StatusResolver.name);

	constructor(
		private statusService: StatusService,
	) {}

	@Query(() => OrchardStatus)
	status() : OrchardStatus {
		this.logger.debug('GET { status }');
		return this.statusService.getStatus();
	}
}
