/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintDatabaseBackup, OrchardMintDatabaseRestore, OrchardMintDatabaseSize} from './mintdatabase.model';

@Injectable()
export class MintDatabaseService {
	private readonly logger = new Logger(MintDatabaseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async createMintDatabaseBackup(tag: string): Promise<OrchardMintDatabaseBackup> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const database_buffer: Buffer = await this.cashuMintDatabaseService.createBackup(client);
				const filebase64 = database_buffer.toString('base64');
				return new OrchardMintDatabaseBackup(filebase64);
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseBackupError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	/** Returns the mint database size in bytes. */
	async getMintDatabaseSize(tag: string): Promise<OrchardMintDatabaseSize> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const size = await this.cashuMintDatabaseService.getMintDatabaseSize(client);
				return new OrchardMintDatabaseSize(size);
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	async restoreMintDatabaseBackup(tag: string, filebase64: string): Promise<OrchardMintDatabaseRestore> {
		try {
			await this.cashuMintDatabaseService.restoreBackup(filebase64);
			return new OrchardMintDatabaseRestore(true);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.MintDatabaseRestoreError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
