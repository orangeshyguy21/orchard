/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintRpcService } from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import { CashuMintKeyset } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintKeyset, MintRotateKeysetOutput } from './mintkeyset.model';
import { MintRotateKeysetInput } from './mintkeyset.input';

@Injectable()
export class MintKeysetService {

	private readonly logger = new Logger(MintKeysetService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintRpcService: CashuMintRpcService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintKeysets() : Promise<OrchardMintKeyset[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_keysets : CashuMintKeyset[] = await this.cashuMintDatabaseService.getMintKeysets(db);
				return cashu_keysets.map( ck => new OrchardMintKeyset(ck));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint keysets from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async mintRotateKeyset(mint_rotate_keyset: MintRotateKeysetInput) : Promise<MintRotateKeysetOutput> {
		try {
			return await this.cashuMintRpcService.rotateNextKeyset(mint_rotate_keyset);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintRpcActionError,
				msg: 'Error rotating next keyset',
			});
			throw new OrchardApiError(error_code);
		}
	}
}