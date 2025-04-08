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
	UpdateMintNameOutput,
	UpdateMintIconOutput,
	UpdateMintDescriptionOutput,
	UpdateMintMotdOutput,
	UpdateMintUrlOutput,
	UpdateContactOutput,
} from './mintinfo.model';
import {
	UpdateMintNameInput,
	UpdateMintIconInput,
	UpdateMintDescriptionInput,
	UpdateMotdInput,
	UpdateUrlInput,
	UpdateContactInput,
} from './mintinfo.input';

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

	async updateMintName(updateMintNameInput: UpdateMintNameInput) : Promise<UpdateMintNameOutput> {
		try {
			await this.cashuMintRpcService.updateName(updateMintNameInput);
			return updateMintNameInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error updating mint name',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintIcon(updateMintIconInput: UpdateMintIconInput) : Promise<UpdateMintIconOutput> {
		try {
			await this.cashuMintRpcService.updateIconUrl(updateMintIconInput);
			return updateMintIconInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error updating mint icon',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintShortDescription(updateMintDescriptionInput: UpdateMintDescriptionInput) : Promise<UpdateMintDescriptionOutput> {
		try {
			await this.cashuMintRpcService.updateShortDescription(updateMintDescriptionInput);
			return updateMintDescriptionInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error updating mint short description',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintLongDescription(updateMintDescriptionInput: UpdateMintDescriptionInput) : Promise<UpdateMintDescriptionOutput> {
		try {
			await this.cashuMintRpcService.updateLongDescription(updateMintDescriptionInput);
			return updateMintDescriptionInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error updating mint long description',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async updateMintMotd(updateMotdInput: UpdateMotdInput) : Promise<UpdateMintMotdOutput> {
		try {
			await this.cashuMintRpcService.updateMotd(updateMotdInput);
			return updateMotdInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error updating mint motd',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async addMintUrl(updateUrlInput: UpdateUrlInput) : Promise<UpdateMintUrlOutput> {
		try {
			await this.cashuMintRpcService.addUrl(updateUrlInput);
			return updateUrlInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error adding mint url',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async removeMintUrl(updateUrlInput: UpdateUrlInput) : Promise<UpdateMintUrlOutput> {
		try {
			await this.cashuMintRpcService.removeUrl(updateUrlInput);
			return updateUrlInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error removing mint url',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async addMintContact(updateContactInput: UpdateContactInput) : Promise<UpdateContactOutput> {
		try {
			await this.cashuMintRpcService.addContact(updateContactInput);
			return updateContactInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error adding mint contact',
			});
			throw new OrchardApiError(error_code);
		}
	}

	async removeMintContact(updateContactInput: UpdateContactInput) : Promise<UpdateContactOutput> {
		try {
			await this.cashuMintRpcService.removeContact(updateContactInput);
			return updateContactInput;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcError,
				msg: 'Error removing mint contact',
			});
			throw new OrchardApiError(error_code);
		}
	}
}