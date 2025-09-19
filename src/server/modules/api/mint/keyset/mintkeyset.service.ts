/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {CashuMintKeyset, CashuMintKeysetProofCount} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {CashuMintKeysetProofsArgs} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintKeyset, OrchardMintKeysetRotation, OrchardMintKeysetProofCount} from './mintkeyset.model';
import {MintRotateKeysetInput} from './mintkeyset.input';

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
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintKeysetProofCounts(tag: string, args?: CashuMintKeysetProofsArgs): Promise<OrchardMintKeysetProofCount[]> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const cashu_keyset_proof_counts: CashuMintKeysetProofCount[] = await this.cashuMintDatabaseService.getMintKeysetProofCounts(
					client,
					args,
				);
				return cashu_keyset_proof_counts.map((ckpc) => new OrchardMintKeysetProofCount(ckpc));
			} catch (error) {
				const error_code = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async mintRotateKeyset(tag: string, mint_rotate_keyset: MintRotateKeysetInput): Promise<OrchardMintKeysetRotation> {
		try {
			return await this.cashuMintRpcService.rotateNextKeyset(mint_rotate_keyset);
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
