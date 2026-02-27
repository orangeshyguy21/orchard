/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {CashuMintKeyset, CashuMintKeysetCount} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {CashuMintKeysetCountsArgs} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintKeyset, OrchardMintKeysetRotation, OrchardMintKeysetCount} from './mintkeyset.model';

@Injectable()
export class MintKeysetService {
	private readonly logger = new Logger(MintKeysetService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintKeysets(tag: string): Promise<OrchardMintKeyset[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_keysets: CashuMintKeyset[] = await this.cashuMintDatabaseService.getMintKeysets(client);
				return cashu_keysets.map((ck) => new OrchardMintKeyset(ck));
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	async getMintKeysetCounts(tag: string, args?: CashuMintKeysetCountsArgs): Promise<OrchardMintKeysetCount[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_keyset_counts: CashuMintKeysetCount[] = await this.cashuMintDatabaseService.getMintKeysetCounts(client, args);
				return cashu_keyset_counts.map((ckc) => new OrchardMintKeysetCount(ckc));
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	async mintRotateKeyset(
		tag: string,
		mint_rotate_keyset: {unit: string; amounts?: number[]; input_fee_ppk?: number; keyset_v2?: boolean},
	): Promise<OrchardMintKeysetRotation> {
		try {
			return await this.cashuMintRpcService.rotateNextKeyset(mint_rotate_keyset);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
