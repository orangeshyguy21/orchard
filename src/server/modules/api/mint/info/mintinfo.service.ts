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
import { 
	OrchardMintInfo,
	OrchardMintInfoRpc,
	OrchardMintNameUpdate,
	OrchardMintIconUpdate,
	OrchardMintDescriptionUpdate,
	OrchardMintMotdUpdate,
	OrchardMintUrlUpdate,
	OrchardMintContactUpdate,
} from './mintinfo.model';
import {
	MintNameUpdateInput,
	MintIconUpdateInput,
	MintDescriptionUpdateInput,
	MintMotdUpdateInput,
	MintUrlUpdateInput,
	MintContactUpdateInput,
} from './mintinfo.input';

@Injectable()
export class MintInfoService {

	private readonly logger = new Logger(MintInfoService.name);

	constructor(
		private cashuMintApiService: CashuMintApiService,
		private cashuMintRpcService: CashuMintRpcService,
		private errorService: ErrorService,
	) {}

	async getMintInfo(tag: string) : Promise<OrchardMintInfo> {
		try {
			const cashu_info : CashuMintInfo = await this.cashuMintApiService.getMintInfo();
			return new OrchardMintInfo(cashu_info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintPublicApiError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async getMintInfoRpc(tag: string) : Promise<OrchardMintInfoRpc> {
		try {
			const cashu_info : CashuMintInfoRpc = await this.cashuMintRpcService.getMintInfo();
			return new OrchardMintInfoRpc(cashu_info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintName(tag: string, mint_name_update: MintNameUpdateInput) : Promise<OrchardMintNameUpdate> {
		try {
			await this.cashuMintRpcService.updateName(mint_name_update);
			return mint_name_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintIcon(tag: string, mint_icon_update: MintIconUpdateInput) : Promise<OrchardMintIconUpdate> {
		try {
			await this.cashuMintRpcService.updateIconUrl(mint_icon_update);
			return mint_icon_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintShortDescription(tag: string, mint_desc_update: MintDescriptionUpdateInput) : Promise<OrchardMintDescriptionUpdate> {
		try {
			await this.cashuMintRpcService.updateShortDescription(mint_desc_update);
			return mint_desc_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintLongDescription(tag: string, mint_desc_update: MintDescriptionUpdateInput) : Promise<OrchardMintDescriptionUpdate> {
		try {
			await this.cashuMintRpcService.updateLongDescription(mint_desc_update);
			return mint_desc_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintMotd(tag: string, mint_motd_update: MintMotdUpdateInput) : Promise<OrchardMintMotdUpdate> {
		try {
			await this.cashuMintRpcService.updateMotd(mint_motd_update);
			return mint_motd_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async addMintUrl(tag: string, mint_url_update: MintUrlUpdateInput) : Promise<OrchardMintUrlUpdate> {
		try {
			await this.cashuMintRpcService.addUrl(mint_url_update);
			return mint_url_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async removeMintUrl(tag: string, mint_url_update: MintUrlUpdateInput) : Promise<OrchardMintUrlUpdate> {
		try {
			await this.cashuMintRpcService.removeUrl(mint_url_update);
			return mint_url_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async addMintContact(tag: string, mint_contact_update: MintContactUpdateInput) : Promise<OrchardMintContactUpdate> {
		try {
			await this.cashuMintRpcService.addContact(mint_contact_update);
			return mint_contact_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	async removeMintContact(tag: string, mint_contact_update: MintContactUpdateInput) : Promise<OrchardMintContactUpdate> {
		try {
			await this.cashuMintRpcService.removeContact(mint_contact_update);
			return mint_contact_update;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}