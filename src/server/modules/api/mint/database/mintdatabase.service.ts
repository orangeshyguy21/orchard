/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintDatabaseVersion } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintDatabase, OrchardMintDatabaseBackup, OrchardMintDatabaseRestore } from './mintdatabase.model';

@Injectable()
export class MintDatabaseService {

	private readonly logger = new Logger(MintDatabaseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintDatabases() : Promise<OrchardMintDatabase[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_databases : CashuMintDatabaseVersion[] = await this.cashuMintDatabaseService.getMintDatabaseVersions(db);
				return cashu_databases.map( cd => new OrchardMintDatabase(cd));
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint db versions from database',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async createMintDatabaseBackup() : Promise<OrchardMintDatabaseBackup> {
		return this.mintService.withDb(async (db) => {
			try {
				const database_buffer : Buffer = await this.cashuMintDatabaseService.createBackup(db);
				const filebase64 = database_buffer.toString('base64');
				return new OrchardMintDatabaseBackup(filebase64);
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseBackupError,
					msg: 'Error creating mint database backup',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async restoreMintDatabaseBackup(filebase64: string) : Promise<OrchardMintDatabaseRestore> {
		return this.mintService.withDb(async (db) => {
			try {
				await this.cashuMintDatabaseService.restoreBackup(db, filebase64);
				return new OrchardMintDatabaseRestore(true);
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseRestoreError,
					msg: 'Error restoring mint database backup',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

}