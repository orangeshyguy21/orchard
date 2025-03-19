/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { OrchardMintInfo } from "./mintinfo.model";

@Resolver(() => [OrchardMintInfo])
export class MintInfoResolver {

	private readonly logger = new Logger(MintInfoResolver.name);

	constructor(
		private mintInfoService: MintInfoService,
	) {}

	@Query(() => OrchardMintInfo)
	async mint_info() : Promise<OrchardMintInfo> {
		try {
			this.logger.debug('GET { mint_info }');
			return await this.mintInfoService.getMintInfo();
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintApiError);
		} 
	}
}
