/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as path from 'path';
import {promises as fs} from 'fs';
/* Vendor Dependencies */
import {Client} from 'pg';
import DatabaseConstructor from 'better-sqlite3';
/* Application Dependencies */
import {MintType} from '@server/modules/cashu/cashu.enums';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
/* Local Dependencies */
import {
	CashuMintDatabase,
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
	CashuMintProofGroup,
	CashuMintPromiseGroup,
} from './cashumintdb.types';
import {
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
	CashuMintMeltQuotesArgs,
} from './cashumintdb.interfaces';
import {MintDatabaseType} from './cashumintdb.enums';

@Injectable()
export class CashuMintDatabaseService implements OnModuleInit {
	private readonly logger = new Logger(CashuMintDatabaseService.name);
	private type: MintType;
	private database: string;

	constructor(
		private configService: ConfigService,
		private nutshellService: NutshellService,
		private cdkService: CdkService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('cashu.type');
		this.database = this.configService.get('cashu.database');
	}

	public async getMintDatabase(): Promise<CashuMintDatabase> {
		try {
			if (this.configService.get('cashu.database_type') === 'sqlite') {
				const db = new DatabaseConstructor(this.database);
				return {type: MintDatabaseType.sqlite, database: db};
			} else {
				const client = new Client({
					connectionString: this.database,
				});
				return {type: MintDatabaseType.postgres, database: client};
			}
		} catch (error) {
			throw OrchardErrorCode.MintDatabaseConnectionError;
		}
	}

	public async getMintBalances(client: CashuMintDatabase, keyset_id?: string): Promise<CashuMintBalance[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintBalances(client, keyset_id);
		if (this.type === 'cdk') return this.cdkService.getMintBalances(client, keyset_id);
	}

	public async getMintBalancesIssued(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintBalancesIssued(client);
		if (this.type === 'cdk') return this.cdkService.getMintBalancesIssued(client);
	}

	public async getMintBalancesRedeemed(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintBalancesRedeemed(client);
		if (this.type === 'cdk') return this.cdkService.getMintBalancesRedeemed(client);
	}

	public async getMintKeysets(client: CashuMintDatabase): Promise<CashuMintKeyset[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintKeysets(client);
		if (this.type === 'cdk') return this.cdkService.getMintKeysets(client);
	}

	public async getMintMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<CashuMintMintQuote[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintMintQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintMintQuotes(client, args);
	}

	public async getMintMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<CashuMintMeltQuote[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintMeltQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintMeltQuotes(client, args);
	}

	public async getMintProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintProofGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintProofGroups(client, args);
	}

	public async getMintPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<CashuMintPromiseGroup[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintPromiseGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintPromiseGroups(client, args);
	}

	public async getMintCountMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountMintQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountMintQuotes(client, args);
	}

	public async getMintCountMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountMeltQuotes(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountMeltQuotes(client, args);
	}

	public async getMintCountProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountProofGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountProofGroups(client, args);
	}

	public async getMintCountPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<number> {
		if (this.type === 'nutshell') return this.nutshellService.getMintCountPromiseGroups(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintCountPromiseGroups(client, args);
	}

	/* Analytics */

	public async getMintAnalyticsBalances(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsBalances(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsBalances(client, args);
	}

	public async getMintAnalyticsMints(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsMints(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsMints(client, args);
	}

	public async getMintAnalyticsMelts(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsMelts(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsMelts(client, args);
	}

	public async getMintAnalyticsTransfers(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsTransfers(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsTransfers(client, args);
	}

	public async getMintAnalyticsFees(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsFees(client, args);
		if (this.type === 'cdk') throw OrchardErrorCode.MintSupportError;
	}

	public async getMintAnalyticsKeysets(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintKeysetsAnalytics[]> {
		if (this.type === 'nutshell') return this.nutshellService.getMintAnalyticsKeysets(client, args);
		if (this.type === 'cdk') return this.cdkService.getMintAnalyticsKeysets(client, args);
	}

	/* Implementation Agnostic */

	public async createBackup(client: CashuMintDatabase): Promise<Buffer> {
		if (client.type === MintDatabaseType.sqlite) return this.createBackupSqlite(client);
		if (client.type === MintDatabaseType.postgres) throw OrchardErrorCode.MintSupportError;
	}

	public async restoreBackup(filebase64: string): Promise<void> {
		if (this.configService.get('cashu.database_type') === 'sqlite') return this.restoreBackupSqlite(filebase64);
		if (this.configService.get('cashu.database_type') === 'postgres') throw OrchardErrorCode.MintSupportError;
	}

	private async createBackupSqlite(client: CashuMintDatabase): Promise<Buffer> {
		const backup_path = path.resolve('temp-backup.db');
		try {
			await client.database.backup(backup_path);
			const file_buffer = await fs.readFile(backup_path);
			await fs.unlink(backup_path);
			return file_buffer;
		} catch (error) {
			this.logger.error(`Error during database backup: ${error.message}`);
			try {
				await fs.unlink(backup_path);
			} catch (cleanup_error) {
				// Ignore cleanup errors
			}
			throw error;
		}
	}

	private async restoreBackupSqlite(filebase64: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const database_buffer: Buffer = Buffer.from(filebase64, 'base64');
			const restore_path = path.resolve('temp-restore.db');

			try {
				await fs.writeFile(restore_path, database_buffer);
				const is_valid_sqlite = await this.validateSqliteFile(restore_path);
				if (!is_valid_sqlite) {
					this.logger.error('Invalid file: Not a valid SQLite database');
					await fs.unlink(restore_path);
					reject(OrchardErrorCode.MintDatabaseRestoreInvalidError);
					return;
				}
				await fs.unlink(this.database);
				fs.copyFile(restore_path, this.database)
					.then(async () => {
						try {
							await fs.unlink(restore_path);
						} catch (cleanup_error) {
							this.logger.warn(`Warning: Could not clean up temporary file: ${cleanup_error.message}`);
						}
						this.logger.log('Database backup restored successfully');
						resolve();
					})
					.catch(async (copy_error) => {
						this.logger.error(`Error restoring database: ${copy_error.message}`);
						try {
							await fs.unlink(restore_path);
						} catch {}
						reject(copy_error);
					});
			} catch (write_error) {
				this.logger.error(`Error writing backup file: ${write_error.message}`);
				reject(write_error);
			}
		});
	}

	private async validateSqliteFile(file_path: string): Promise<boolean> {
		try {
			const file_handle = await fs.open(file_path, 'r');
			const buffer = Buffer.alloc(16);
			await file_handle.read(buffer, 0, 16, 0);
			await file_handle.close();
			const sqlite_header = Buffer.from('SQLite format 3\0');
			if (!buffer.equals(sqlite_header)) return false;
			const test_db = new DatabaseConstructor(file_path);
			const row = await test_db.prepare("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1").get();
			test_db.close();
			return row !== undefined;
		} catch (error) {
			this.logger.error(`Error validating SQLite file: ${error.message}`);
			return false;
		}
	}
}
