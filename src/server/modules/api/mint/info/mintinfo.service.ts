/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import { GraphQLError } from 'graphql';
/* Application Dependencies */
import { CashuMintApiService } from '@server/modules/cashu/mintapi/cashumintapi.service';
import { CashuMintInfo } from '@server/modules/cashu/mintapi/cashumintapi.types';
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
/* Local Dependencies */
import { OrchardMintInfo } from './mintinfo.model';

@Injectable()
export class MintInfoService {

	private readonly logger = new Logger(MintInfoService.name);

	constructor(
		private cashuMintApiService: CashuMintApiService,
	) {}

	async getMintInfo() : Promise<OrchardMintInfo> {
		try {
			throw new GraphQLError(OrchardApiErrors.MintApiError);
			const cashu_info : CashuMintInfo = await this.cashuMintApiService.getMintInfo();
			return new OrchardMintInfo(cashu_info);
		} catch (error) {
			this.logger.error('Error getting mint information from mint api');
			this.logger.debug(`Error getting mint information from mint api: ${error}`);
			throw new GraphQLError(OrchardApiErrors.MintApiError);
		}
	}
}