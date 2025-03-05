/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query} from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Internal Dependencies */
import { OrchardMintAnalytics } from "./mintanalytics.model";
import { MintAnalyticsService } from "./mintanalytics.service";

@Resolver(() => [OrchardMintAnalytics])
export class MintAnalyticsResolver {

	private readonly logger = new Logger(MintAnalyticsResolver.name);

	constructor(
		private mintAnalyticsService: MintAnalyticsService,
	) {}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_balances() : Promise<OrchardMintAnalytics[]> {
		try {
			this.logger.debug('GET { mint_analytics_balances }');
			return this.mintAnalyticsService.getMintAnalyticsBalances();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}