/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {Database} from 'better-sqlite3';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {CashuMintDatabase} from '@server/modules/cashu/mintdb/cashumintdb.types';

@Injectable()
export class MintService {
	private readonly logger = new Logger(MintService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private errorService: ErrorService,
	) {}

	public async withDbClient<T>(action: (client: CashuMintDatabase) => Promise<T>): Promise<T> {
		let client: CashuMintDatabase;

		try {
			client = await this.cashuMintDatabaseService.getMintDatabase();
			if (client.type === 'postgres') await client.database.connect();
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, 'Error connecting to mint database', {
				errord: OrchardErrorCode.MintDatabaseConnectionError,
			});
			throw new OrchardApiError(error_code);
		}

		try {
			return await action(client);
		} finally {
			if (!client) return;
			if (client.type === 'sqlite') client.database.close();
			if (client.type === 'postgres') client.database.end();
		}
	}
}
