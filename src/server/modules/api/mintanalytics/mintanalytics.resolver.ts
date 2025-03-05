/* Core Dependencies */
import { Resolver, Query} from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Internal Dependencies */
import { OrchardMintAnalytics } from "./mintanalytics.model";
import { MintAnalyticsService } from "./mintanalytics.service";

@Resolver(() => [OrchardMintAnalytics])
export class MintAnalyticsResolver {
	constructor(
		private mintAnalyticsService: MintAnalyticsService,
	) {}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_balances() : Promise<OrchardMintAnalytics[]> {
		try {
			return this.mintAnalyticsService.getMintAnalyticsBalances();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}