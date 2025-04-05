/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { ErrorService } from '@server/modules/error/error.service';
@Injectable()
export class MintService {

	private readonly logger = new Logger(MintService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private errorService: ErrorService,
	) {}

	public async withDb<T>(action: (db: sqlite3.Database) => Promise<T>): Promise<T> {
		let db: sqlite3.Database;

		try {
			db = await this.cashuMintDatabaseService.getMintDatabase();
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.MintDatabaseConnectionError,
				msg: 'Error connecting to mint database',
			});
			throw new OrchardApiError(error_code);
		}

		try {
			return await action(db);
		} finally {
			if (db) db.close();
		}
	}
}