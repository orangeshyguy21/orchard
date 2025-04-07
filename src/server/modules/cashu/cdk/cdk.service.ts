/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import sqlite3 from "sqlite3";
/* Application Dependencies */
import { OrchardErrorCode } from '@server/modules/error/error.types';
/* Native Dependencies */
import { 
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintProof,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import { 
	CashuMintMintQuotesArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';

@Injectable()
export class CdkService {

	private readonly logger = new Logger(CdkService.name);

	constructor(
		private configService: ConfigService,
	) {}

	public initializeGrpcClient() : grpc.Client {
        const rpc_key = this.configService.get('cashu.rpc_key');
        const rpc_cert = this.configService.get('cashu.rpc_cert');
        const rpc_ca = this.configService.get('cashu.rpc_ca');
        const rpc_host = this.configService.get('cashu.rpc_host');
        const rpc_port = this.configService.get('cashu.rpc_port');
        const rpc_url = `${rpc_host}:${rpc_port}`;

        if (!rpc_key || !rpc_cert || !rpc_ca || !rpc_host || !rpc_port) {
            this.logger.warn('Missing RPC credentials, secure connection cannot be established');
            return;
        }
        
        try {
            const proto_path = path.resolve(__dirname, '../../../../proto/cdk-mint-rpc.proto');
            const package_definition = protoLoader.loadSync(proto_path, {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
            const mint_proto: any = grpc.loadPackageDefinition(package_definition).cdk_mint_rpc;
            const key_content = fs.readFileSync(rpc_key);
            const cert_content = fs.readFileSync(rpc_cert);
            const ca_content = rpc_ca ? fs.readFileSync(rpc_ca) : undefined;
            const ssl_credentials = grpc.credentials.createSsl(
                ca_content,
                key_content,
                cert_content
            );
			this.logger.log('Mint gRPC client initialized with TLS certificate authentication');
            return new mint_proto.CdkMint(
                rpc_url,
                ssl_credentials
            );
        } catch (error) {
			this.logger.error(`Failed to initialize gRPC client: ${error.message}`);
        }
    }

	public async getMintBalances(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = `
		WITH issued_mint_sum AS (
			SELECT 
				bs.keyset_id AS keyset,
				SUM(DISTINCT mq.amount) AS amount
			FROM mint_quote mq
			JOIN blind_signature bs ON bs.quote_id = mq.id
			WHERE mq.state = 'ISSUED'
			GROUP BY bs.keyset_id
		),

		all_proofs_sum AS (
			SELECT 
				keyset_id AS keyset,
				SUM(amount) AS amount
			FROM proof
			GROUP BY keyset_id
		),

		blind_sig_sum AS (
			SELECT 
				keyset_id AS keyset,
				SUM(amount) AS amount
			FROM blind_signature
			WHERE quote_id IS NULL
			GROUP BY keyset_id
		),

		paid_melt_sum AS (
			SELECT 
				bs.keyset_id AS keyset,
				SUM(DISTINCT mq.amount) AS amount
			FROM melt_quote mq
			JOIN blind_signature bs ON bs.quote_id = mq.id
			WHERE mq.state = 'PAID'
			GROUP BY bs.keyset_id
		)

		SELECT 
			COALESCE(ims.keyset, aps.keyset, bss.keyset, pms.keyset) AS keyset,
			COALESCE(ims.amount, 0) - 
			COALESCE(aps.amount, 0) + 
			COALESCE(bss.amount, 0) - 
			COALESCE(pms.amount, 0) AS balance
		FROM 
			issued_mint_sum ims
			FULL OUTER JOIN all_proofs_sum aps ON ims.keyset = aps.keyset
			FULL OUTER JOIN blind_sig_sum bss ON COALESCE(ims.keyset, aps.keyset) = bss.keyset
			FULL OUTER JOIN paid_melt_sum pms ON COALESCE(ims.keyset, aps.keyset, bss.keyset) = pms.keyset
		WHERE 
			COALESCE(ims.keyset, aps.keyset, bss.keyset, pms.keyset) IS NOT NULL
		ORDER BY keyset;`;

		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = `
		SELECT keyset, COALESCE(s, 0) AS balance FROM (
			SELECT k.id AS keyset, SUM(mq.amount) AS s
			FROM keyset k
			JOIN mint_quote mq ON k.unit = mq.unit
			WHERE k.active = 1 AND mq.state = 'ISSUED'
			GROUP BY k.id
		);`;
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				console.log(rows);
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = `
		SELECT keyset, COALESCE(s, 0) AS balance FROM (
			SELECT k.id AS keyset, SUM(mq.amount) AS s
			FROM keyset k
			JOIN melt_quote mq ON k.unit = mq.unit
			WHERE k.active = 1 AND mq.state = 'PAID'
			GROUP BY k.id
		);`;
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintKeysets(db:sqlite3.Database) : Promise<CashuMintKeyset[]> {
		const sql = 'SELECT * FROM keyset;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintKeyset[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	// public async getMintDatabaseVersions(db:sqlite3.Database) : Promise<CashuMintDatabaseVersion[]> {
	// 	const sql = 'SELECT * FROM dbversions;';
	// 	return new Promise((resolve, reject) => {
	// 		db.all(sql, (err, rows:CashuMintDatabaseVersion[]) => {
	// 			if (err) reject(err);
	// 			resolve(rows);
	// 		});
	// 	});
	// }

	public async getMintMeltQuotes(db:sqlite3.Database) : Promise<CashuMintMeltQuote[]> {
		const sql = 'SELECT * FROM melt_quote;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintMeltQuote[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

  	public async getMintMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<CashuMintMintQuote[]> {
		const field_mappings = {
			unit: 'unit',
			date_start: 'expiry',
			date_end: 'expiry',
			status: 'state'
		};
		const { sql, params } = buildDynamicQuery('mint_quote', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:CashuMintMintQuote[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
    }

	// public async getMintPromises(db:sqlite3.Database, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {
	// 	const field_mappings = {
	// 		id_keysets: 'keyset_id',
	// 		date_start: 'created',
	// 		date_end: 'created'
	// 	};
	// 	const { sql, params } = buildDynamicQuery('blind_signature', args, field_mappings);
	// 	return new Promise((resolve, reject) => {
	// 		db.all(sql, params, (err, rows:CashuMintPromise[]) => {
	// 			if (err) reject(err);
	// 			resolve(rows);
	// 		});
	// 	});
	// }

	public async getMintProofsPending(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		const sql = 'SELECT * FROM proof WHERE state = "PENDING";';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintProof[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintProofsUsed(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		const sql = 'SELECT * FROM proof WHERE state = "SPENT";';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintProof[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}  	
}