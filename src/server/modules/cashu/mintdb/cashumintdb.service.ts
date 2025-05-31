/* Core Dependencies */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
import { promises as fs } from 'fs';
/* Application Dependencies */
import { NutshellService } from '@server/modules/cashu/nutshell/nutshell.service';
import { CdkService } from '@server/modules/cashu/cdk/cdk.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
/* Local Dependencies */
import { 
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintDatabaseVersion,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintPromise,
	CashuMintProof,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
} from './cashumintdb.types';
import { 
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintPromisesArgs,
	CashuMintMeltQuotesArgs,
} from './cashumintdb.interfaces';

@Injectable()
export class CashuMintDatabaseService implements OnModuleInit {

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

	public async getMintDatabaseVersions(db:sqlite3.Database) : Promise<CashuMintDatabaseVersion[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintDatabaseVersions(db);
		if( this.backend === 'cdk' ) throw OrchardErrorCode.MintSupportError;
	}

	public async getMintMeltQuotes(db:sqlite3.Database, args?: CashuMintMeltQuotesArgs) : Promise<CashuMintMeltQuote[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintMeltQuotes(db);
		if( this.backend === 'cdk' ) return this.cdkService.getMintMeltQuotes(db);
	}

  	public async getMintMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<CashuMintMintQuote[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintMintQuotes(db, args);
		if( this.backend === 'cdk' ) return this.cdkService.getMintMintQuotes(db, args);
    }

	public async getMintPromises(db:sqlite3.Database, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintPromises(db, args);
		if( this.backend === 'cdk' ) throw OrchardErrorCode.MintSupportError;
	}

	public async getMintProofsPending(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintProofsPending(db);
		if( this.backend === 'cdk' ) throw OrchardErrorCode.MintSupportError;
	}

	public async getMintProofsUsed(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintProofsUsed(db);
		if( this.backend === 'cdk' ) throw OrchardErrorCode.MintSupportError;
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
		if( this.backend === 'nutshell' )  throw OrchardErrorCode.MintSupportError;
		if( this.backend === 'cdk' ) return this.cdkService.getMintAnalyticsKeysets(db, args);
	}

	/* Implementation Agnostic */

	public async createBackup(db:sqlite3.Database) : Promise<void> {
		return new Promise((resolve, reject) => {
			db.run("VACUUM INTO 'backup.db'", (err) => {
				if (err) {
					console.error('Error during database backup:', err);
					reject(err);
				} else {
					console.log('Database backup completed successfully');
					resolve();
				}
			});
		});
		// if( this.backend === 'nutshell' ) return this.nutshellService.backupDatabase(db);
		// if( this.backend === 'cdk' ) throw OrchardErrorCode.MintSupportError;
	}


	public async restoreBackup(uploaded_file_buffer: Buffer): Promise<void> {
		const temp_path = `temp-restore-${Date.now()}.db`;
		
		try {
			// Write uploaded buffer to temporary file
			await fs.writeFile(temp_path, uploaded_file_buffer);
			
			// Verify it's a valid SQLite database
			const temp_db = await this.getMintDatabase();
			await new Promise((resolve, reject) => {
				const test_db = new sqlite3d.Database(temp_path, (err) => {
					if (err) reject(err);
					else {
						test_db.close();
						resolve(null);
					}
				});
			});
			
			// Replace current database
			await fs.copyFile(temp_path, this.database);
			
			console.log('Database restored from uploaded file successfully');
		} catch (err) {
			console.error('Error restoring from uploaded file:', err);
			throw err;
		} finally {
			// Clean up temp file
			try {
				await fs.unlink(temp_path);
			} catch {}
		}
	}
}