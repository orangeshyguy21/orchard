/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
import { GraphQLError } from 'graphql';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";

@Injectable()
export class MintService {

	private readonly logger = new Logger(MintService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	public async withDb<T>(action: (db: sqlite3.Database) => Promise<T>): Promise<T> {
		let db: sqlite3.Database;
		try {
			db = await this.cashuMintDatabaseService.getMintDatabaseAsync();
		} catch (error) {
			this.logger.error('Error connecting to mint database');
			this.logger.debug(`Error connecting to mint database: ${error}`);
			throw new GraphQLError(OrchardApiErrors.MintDatabaseConnectionError);
		}

		try {
			return await action(db);
		} finally {
			if (db) db.close();
		}
	}
}