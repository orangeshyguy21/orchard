/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
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
	@UseGuards(GqlAuthGuard)
	async status() : Promise<OrchardStatus> {
		this.logger.debug('GET { status }');
		return await this.statusService.getStatus();
	}
}
