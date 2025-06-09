/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { promises as fs } from 'fs';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
/* Application Dependencies */
import { NutshellService } from '@server/modules/cashu/nutshell/nutshell.service';
import { CdkService } from '@server/modules/cashu/cdk/cdk.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
/* Local Dependencies */
import { 
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintPromise,
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

@Injectable()
export class CashuMintDatabaseService implements OnModuleInit {

	private readonly logger = new Logger(CashuMintDatabaseService.name);
	private backend: 'cdk' | 'nutshell';
	private database: string;

	constructor(
		private configService: ConfigService,
		private nutshellService: NutshellService,
		private cdkService: CdkService,
	) {}

	public async onModuleInit() {
		this.backend = this.configService.get('cashu.backend');
		this.database = this.configService.get('cashu.database');
	}

	public async getMintDatabase() : Promise<sqlite3.Database> {
		return new Promise((resolve, reject) => {
			const db = new sqlite3d.Database(this.database, (err) => {
				if (err) reject(err);
				resolve(db);
			});
		});
	}

	public async getMintBalances(db:sqlite3.Database, keyset_id?: string) : Promise<CashuMintBalance[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintBalances(db, keyset_id);
		if( this.backend === 'cdk' ) return this.cdkService.getMintBalances(db, keyset_id);
	}

	public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintBalancesIssued(db);
		if( this.backend === 'cdk' ) return this.cdkService.getMintBalancesIssued(db);
	}

	public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintBalancesRedeemed(db);
		if( this.backend === 'cdk' ) return  this.cdkService.getMintBalancesRedeemed(db);
	}

	public async getMintKeysets(db:sqlite3.Database) : Promise<CashuMintKeyset[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintKeysets(db);
		if( this.backend === 'cdk' ) return this.cdkService.getMintKeysets(db);
	}

	public async getMintMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<CashuMintMintQuote[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintMintQuotes(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintMintQuotes(db, args);
    }

	public async getMintMeltQuotes(db:sqlite3.Database, args?: CashuMintMeltQuotesArgs) : Promise<CashuMintMeltQuote[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintMeltQuotes(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintMeltQuotes(db, args);
	}

	public async getMintPromises(db:sqlite3.Database, args?: any) : Promise<CashuMintPromise[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintPromises(db, args);
		if( this.backend === 'cdk' ) throw OrchardErrorCode.MintSupportError;
	}

	public async getMintProofGroups(db:sqlite3.Database, args?: CashuMintProofsArgs) : Promise<CashuMintProofGroup[]> {
		if( this.backend === 'nutshell' ) throw OrchardErrorCode.MintSupportError;
		if( this.backend === 'cdk' ) return this.cdkService.getMintProofGroups(db, args);
	}

	public async getMintPromiseGroups(db:sqlite3.Database, args?: CashuMintPromiseArgs) : Promise<CashuMintPromiseGroup[]> {
		if( this.backend === 'nutshell' ) throw OrchardErrorCode.MintSupportError;
		if( this.backend === 'cdk' ) return this.cdkService.getMintPromiseGroups(db, args);
	}

	public async getMintCountMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<number> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintCountMintQuotes(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintCountMintQuotes(db, args);
	}

	public async getMintCountMeltQuotes(db:sqlite3.Database, args?: CashuMintMeltQuotesArgs) : Promise<number> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintCountMeltQuotes(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintCountMeltQuotes(db, args);
	}

	public async getMintCountProofGroups(db:sqlite3.Database, args?: CashuMintProofsArgs) : Promise<number> {
		if( this.backend === 'nutshell' ) throw OrchardErrorCode.MintSupportError;
		if( this.backend === 'cdk' ) return this.cdkService.getMintCountProofGroups(db, args);
	}

  	/* Analytics */

  	public async getMintAnalyticsBalances(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsBalances(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintAnalyticsBalances(db, args);
	}

	public async getMintAnalyticsMints(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsMints(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintAnalyticsMints(db, args);
 	}

	public async getMintAnalyticsMelts(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsMelts(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintAnalyticsMelts(db, args);
 	}

	public async getMintAnalyticsTransfers(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsTransfers(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintAnalyticsTransfers(db, args);
	}

	public async getMintAnalyticsKeysets(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintKeysetsAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsKeysets(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintAnalyticsKeysets(db, args);
	}

	/* Implementation Agnostic */

	public async createBackup(db: sqlite3.Database): Promise<Buffer> {
		return new Promise(async (resolve, reject) => {
			const backup_path = path.resolve('temp-backup.db');
			db.run(`VACUUM INTO '${backup_path}'`, async (error) => {
				if (error) {
					this.logger.error(`Error during database backup: ${error.message}`);
					reject(error);
				} else {
					try {
						const file_buffer = await fs.readFile(backup_path);
						await fs.unlink(backup_path);
						resolve(file_buffer);
					} catch (read_error) {
						this.logger.error(`Error reading backup file: ${read_error.message}`);
						try {
							await fs.unlink(backup_path);
						} catch {}
						reject(read_error);
					}
				}
			});
		});
	}

	public async restoreBackup(filebase64: string): Promise<void> {
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
			const test_db = new sqlite3d.Database(file_path);
			return new Promise((resolve) => {
				test_db.get("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1", (err, row) => {
					test_db.close();
					resolve(!err);
				});
			});
		} catch (error) {
			this.logger.error(`Error validating SQLite file: ${error.message}`);
			return false;
		}
	}
}