/* Core Dependencies */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
/* Application Dependencies */
import { NutshellService } from '@server/modules/cashu/nutshell/nutshell.service';
import { CdkService } from '@server/modules/cashu/cdk/cdk.service';
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
} from './cashumintdb.types';
import { 
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintPromisesArgs,
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

	public async getMintBalances(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintBalances(db);
		if( this.backend === 'cdk' ) return this.cdkService.getMintBalances(db);
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintBalancesIssued(db);
		if( this.backend === 'cdk' ) return this.cdkService.getMintBalancesIssued(db);
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintBalancesRedeemed(db);
		if( this.backend === 'cdk' ) return  this.cdkService.getMintBalancesRedeemed(db);
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintKeysets(db:sqlite3.Database) : Promise<CashuMintKeyset[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintKeysets(db);
		if( this.backend === 'cdk' ) return this.cdkService.getMintKeysets(db);
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintDatabaseVersions(db:sqlite3.Database) : Promise<CashuMintDatabaseVersion[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintDatabaseVersions(db);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintMeltQuotes(db:sqlite3.Database) : Promise<CashuMintMeltQuote[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintMeltQuotes(db);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}

  	public async getMintMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<CashuMintMintQuote[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintMintQuotes(db, args);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
    }

	public async getMintPromises(db:sqlite3.Database, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintPromises(db, args);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintProofsPending(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintProofsPending(db);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintProofsUsed(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintProofsUsed(db);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}

  	/* Analytics */

  	public async getMintAnalyticsBalances(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsBalances(db, args);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}

	public async getMintAnalyticsMints(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsMints(db, args);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
 	}

	public async getMintAnalyticsMelts(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsMelts(db, args);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
 	}

	public async getMintAnalyticsTransfers(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		if( this.backend === 'nutshell' ) return this.nutshellService.getMintAnalyticsTransfers(db, args);
		if( this.backend === 'cdk' ) throw new Error('CDK MINT_BACKEND not implemented');
		throw new Error('Invalid MINT_BACKEND');
	}
}