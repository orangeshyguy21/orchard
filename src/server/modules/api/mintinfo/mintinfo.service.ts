/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintApiService } from '@server/modules/cashu/mintapi/cashumintapi.service';
import { CashuMintInfo } from '@server/modules/cashu/mintapi/cashumintapi.types';
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
			this.logger.error('Error getting mint information from mint api', { error });
			throw new Error(error);
		}
	}
}