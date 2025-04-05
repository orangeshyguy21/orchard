/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { OrchardErrorCode } from "@server/modules/error/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";

@Injectable()
export class MintService {

	private readonly logger = new Logger(MintService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	public async withDb<T>(action: (db: sqlite3.Database) => Promise<T>): Promise<T> {
		let db: sqlite3.Database;
		
		try {
			db = await this.cashuMintDatabaseService.getMintDatabase();
		} catch (error) {
			this.logger.error('Error connecting to mint database');
			this.logger.debug(`Error connecting to mint database: ${error}`);
			throw new OrchardApiError(OrchardErrorCode.MintDatabaseConnectionError);
		}

		try {
			return await action(db);
		} finally {
			if (db) db.close();
		}
	}
}