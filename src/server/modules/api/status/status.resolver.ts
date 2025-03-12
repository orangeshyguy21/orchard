/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
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
	async status() : Promise<OrchardStatus> {
		try {
			this.logger.debug('GET { status }');
			return await this.statusService.getStatus();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.StatusError);
		}
	}
}
