/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintApiService } from '@server/modules/cashu/mintapi/cashumintapi.service';
import { CashuMintInfo } from '@server/modules/cashu/mintapi/cashumintapi.types';
import { OrchardErrorCode } from "@server/modules/error/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
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
			const cashu_info : CashuMintInfo = await this.cashuMintApiService.getMintInfo();
			return new OrchardMintInfo(cashu_info);
		} catch (error) {
			this.logger.error('Error getting mint information from mint api');
			this.logger.debug(`Error getting mint information from mint api: ${error}`);
			let error_code = OrchardErrorCode.MintDatabaseSelectError;
			if( error === OrchardErrorCode.MintSupportError ) error_code = OrchardErrorCode.MintSupportError;
			throw new OrchardApiError(error_code);
		}
	}
}