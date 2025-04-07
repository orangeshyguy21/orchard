/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintApiService } from '@server/modules/cashu/mintapi/cashumintapi.service';
import { CashuMintRpcService } from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import { CashuMintInfo } from '@server/modules/cashu/mintapi/cashumintapi.types';
import { CashuMintInfoRpc } from '@server/modules/cashu/mintrpc/cashumintrpc.types';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintInfo, OrchardMintInfoRpc } from './mintinfo.model';
import { UpdateMintNameInput } from './mintinfo.resolver';

@Injectable()
export class MintInfoService {

	private readonly logger = new Logger(MintInfoService.name);

	constructor(
		private cashuMintApiService: CashuMintApiService,
		private cashuMintRpcService: CashuMintRpcService,
		private errorService: ErrorService,
	) {}

	async getMintInfo() : Promise<OrchardMintInfo> {
		try {
			const cashu_info : CashuMintInfo = await this.cashuMintApiService.getMintInfo();
			return new OrchardMintInfo(cashu_info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintPublicApiError,
				msg: 'Error getting mint information from mint api',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async getMintInfoRpc() : Promise<OrchardMintInfoRpc> {
		try {
			const cashu_info : CashuMintInfoRpc = await this.cashuMintRpcService.getMintInfo();
			return new OrchardMintInfoRpc(cashu_info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error getting mint information from mint rpc',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintName(updateMintNameInput: UpdateMintNameInput) : Promise<boolean> {
		try {
			const update_response = await this.cashuMintRpcService.updateName(updateMintNameInput.name);
			return ( update_response ) ? true : false;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error updating mint name',
			});
			throw new OrchardApiError(error_code);
		}
	}
}