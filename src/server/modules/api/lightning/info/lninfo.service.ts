/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {LightningInfo} from '@server/modules/lightning/lightning/lightning.types';
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import {OrchardLightningInfo} from './lninfo.model';

@Injectable()
export class LightningInfoService {
	private readonly logger = new Logger(LightningInfoService.name);

	constructor(
		private lightningService: LightningService,
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private configService: ConfigService,
		private errorService: ErrorService,
	) {}

	async getLightningInfo(tag: string): Promise<OrchardLightningInfo> {
		try {
			const lightning_info: LightningInfo = await this.lightningService.getLightningInfo();
			const backend = await this.determineMintBackend(lightning_info.identity_pubkey);
			return new OrchardLightningInfo(lightning_info, backend);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	/**
	 * Determines if this lightning node is the backend for the configured cashu mint
	 * Checks the most recent mint quote's invoice destination against the node's pubkey
	 */
	private async determineMintBackend(identity_pubkey: string): Promise<boolean> {
		try {
			if (!this.configService.get('cashu.type') || !this.configService.get('cashu.database')) return false;
			return await this.mintService.withDbClient(async (client) => {
				const quotes = await this.cashuMintDatabaseService.getMintMintQuotes(client, {page_size: 1, page: 1});
				if (!quotes?.length) return false;
				const invoice = quotes[0].request;
				if (!invoice) return false;
				const decoded = await this.lightningService.getLightningRequest(invoice);
				return decoded?.destination === identity_pubkey;
			});
		} catch {
			return false;
		}
	}
}
