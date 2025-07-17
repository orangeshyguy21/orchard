/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import sqlite3 from 'sqlite3';
/* Native Dependencies */
import {
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintProofGroup,
	CashuMintPromiseGroup,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
	CashuMintCount,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {
	CashuMintMintQuotesArgs,
	CashuMintAnalyticsArgs,
	CashuMintMeltQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
	buildCountQuery,
	getAnalyticsTimeGroupStamp,
	getAnalyticsConditions,
	getAnalyticsTimeGroupSql,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';
import {MintAnalyticsInterval} from '@server/modules/cashu/mintdb/cashumintdb.enums';

@Injectable()
export class CdkService {
	private readonly logger = new Logger(CdkService.name);

	constructor(private configService: ConfigService) {}

	public initializeGrpcClient(): grpc.Client {
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
			const proto_path = path.resolve(__dirname, '../../../../proto/cdk/cdk-mint-rpc.proto');
			const package_definition = protoLoader.loadSync(proto_path, {
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true,
			});
			const mint_proto: any = grpc.loadPackageDefinition(package_definition).cdk_mint_rpc;
			const key_content = fs.readFileSync(rpc_key);
			const cert_content = fs.readFileSync(rpc_cert);
			const ca_content = rpc_ca ? fs.readFileSync(rpc_ca) : undefined;
			const ssl_credentials = grpc.credentials.createSsl(ca_content, key_content, cert_content);
			this.logger.log('Mint gRPC client initialized with TLS certificate authentication');
			return new mint_proto.CdkMint(rpc_url, ssl_credentials);
		} catch (error) {
			this.logger.error(`Failed to initialize gRPC client: ${error.message}`);
		}
	}

	public async getMintBalances(db: sqlite3.Database, keyset_id?: string): Promise<CashuMintBalance[]> {
		const where_clause = keyset_id ? 'WHERE keyset_id = ?' : '';
		const sql = `
			WITH issued AS (
				SELECT keyset_id, SUM(amount) AS issued_amount
				FROM blind_signature
				${where_clause}
				GROUP BY keyset_id
			),
			redeemed AS (
				SELECT keyset_id, SUM(amount) AS redeemed_amount
				FROM proof
				WHERE state = 'SPENT'
				${keyset_id ? 'AND keyset_id = ?' : ''}
				GROUP BY keyset_id
			)
			SELECT 
				COALESCE(i.keyset_id, r.keyset_id) AS keyset,
				COALESCE(i.issued_amount, 0) - COALESCE(r.redeemed_amount, 0) AS balance
			FROM issued i
			FULL OUTER JOIN redeemed r ON i.keyset_id = r.keyset_id
			ORDER BY keyset;
		`;

		const params = keyset_id ? [keyset_id, keyset_id] : [];
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: CashuMintBalance[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesIssued(db: sqlite3.Database): Promise<CashuMintBalance[]> {
		const sql = `
			SELECT keyset_id AS keyset, SUM(amount) AS balance
			FROM blind_signature
			GROUP BY keyset_id
			ORDER BY keyset_id;`;
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows: CashuMintBalance[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesRedeemed(db: sqlite3.Database): Promise<CashuMintBalance[]> {
		const sql = `
			SELECT keyset_id AS keyset, SUM(amount) AS balance
			FROM proof
			WHERE state = 'SPENT'
			GROUP BY keyset_id
			ORDER BY keyset_id;`;
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows: CashuMintBalance[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintKeysets(db: sqlite3.Database): Promise<CashuMintKeyset[]> {
		const sql = 'SELECT * FROM keyset WHERE unit != ?;';
		return new Promise((resolve, reject) => {
			db.all(sql, ['auth'], (err, rows: CashuMintKeyset[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintMintQuotes(db: sqlite3.Database, args?: CashuMintMintQuotesArgs): Promise<CashuMintMintQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildDynamicQuery('mint_quote', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: CashuMintMintQuote[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintCountMintQuotes(db: sqlite3.Database, args?: CashuMintMintQuotesArgs): Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildCountQuery('mint_quote', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.get(sql, params, (err, row: CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public async getMintMeltQuotes(db: sqlite3.Database, args?: CashuMintMeltQuotesArgs): Promise<CashuMintMeltQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildDynamicQuery('melt_quote', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: CashuMintMeltQuote[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintProofGroups(db: sqlite3.Database, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
		const field_mappings = {
			states: 'p.state',
			units: 'k.unit',
			id_keysets: 'p.keyset_id',
			date_start: 'p.created_time',
			date_end: 'p.created_time',
		};

		const select_statement = `
			SELECT 
				p.created_time,
				p.keyset_id,
				k.unit,
				p.state,
				json_group_array(p.amount) as amounts
			FROM proof p
			LEFT JOIN keyset k ON k.id = p.keyset_id`;

		const group_by = 'p.created_time, k.unit, p.state, p.keyset_id';

		const {sql, params} = buildDynamicQuery('proof', args, field_mappings, select_statement, group_by);

		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);
				const groups = {};
				rows.forEach((row) => {
					const key = `${row.created_time}_${row.unit}_${row.state}`;
					if (!groups[key]) {
						groups[key] = {
							created_time: row.created_time,
							unit: row.unit,
							state: row.state,
							keysets: [],
							amounts: [],
						};
					}
					groups[key].keysets.push(row.keyset_id);
					groups[key].amounts.push(JSON.parse(row.amounts));
				});

				const proof_groups: CashuMintProofGroup[] = Object.values(groups).map((group: any) => ({
					amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
					created_time: group.created_time,
					keyset_ids: group.keysets,
					unit: group.unit,
					state: group.state,
					amounts: group.amounts,
				}));
				resolve(proof_groups);
			});
		});
	}

	public async getMintPromiseGroups(db: sqlite3.Database, args?: CashuMintPromiseArgs): Promise<CashuMintPromiseGroup[]> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'bs.keyset_id',
			date_start: 'bs.created_time',
			date_end: 'bs.created_time',
		};

		const select_statement = `
			SELECT 
				bs.created_time,
				bs.keyset_id,
				k.unit,
				json_group_array(bs.amount) as amounts
			FROM blind_signature bs
			LEFT JOIN keyset k ON k.id = bs.keyset_id`;

		const group_by = 'bs.created_time, k.unit, bs.keyset_id';

		const {sql, params} = buildDynamicQuery('blind_signature', args, field_mappings, select_statement, group_by);

		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);
				const groups = {};
				rows.forEach((row) => {
					const key = `${row.created_time}_${row.unit}`;
					if (!groups[key]) {
						groups[key] = {
							created_time: row.created_time,
							unit: row.unit,
							keysets: [],
							amounts: [],
						};
					}
					groups[key].keysets.push(row.keyset_id);
					groups[key].amounts.push(JSON.parse(row.amounts));
				});

				const promise_groups: CashuMintPromiseGroup[] = Object.values(groups).map((group: any) => ({
					amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
					created_time: group.created_time,
					keyset_ids: group.keysets,
					unit: group.unit,
					amounts: group.amounts,
				}));
				resolve(promise_groups);
			});
		});
	}

	public async getMintCountMeltQuotes(db: sqlite3.Database, args?: CashuMintMeltQuotesArgs): Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildCountQuery('melt_quote', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.get(sql, params, (err, row: CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public async getMintCountProofGroups(db: sqlite3.Database, args?: CashuMintProofsArgs): Promise<number> {
		const field_mappings = {
			states: 'p.state',
			units: 'k.unit',
			id_keysets: 'p.keyset_id',
			date_start: 'p.created_time',
			date_end: 'p.created_time',
		};

		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT 
					p.created_time,
					p.keyset_id,
					k.unit,
					p.state
				FROM proof p
				LEFT JOIN keyset k ON k.id = p.keyset_id`;

		const group_by = 'p.created_time, k.unit, p.state';
		const {sql, params} = buildCountQuery('proof', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');

		return new Promise((resolve, reject) => {
			db.get(final_sql, params, (err, row: CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public async getMintCountPromiseGroups(db: sqlite3.Database, args?: CashuMintPromiseArgs): Promise<number> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'bs.keyset_id',
			date_start: 'bs.created_time',
			date_end: 'bs.created_time',
		};

		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT 
					bs.created_time,
					bs.keyset_id,
					k.unit
				FROM blind_signature bs
				LEFT JOIN keyset k ON k.id = bs.keyset_id`;

		const group_by = 'bs.created_time, k.unit';
		const {sql, params} = buildCountQuery('blind_signature', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');

		return new Promise((resolve, reject) => {
			db.get(final_sql, params, (err, row: CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	/* Analytics */

	public async getMintAnalyticsBalances(db: sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
		});

		const sqlite_sql = `
			WITH mint_data AS (
				SELECT 
					${time_group_sql} AS time_group,
					unit,
					SUM(CASE WHEN state = 'ISSUED' THEN amount ELSE 0 END) AS mint_amount,
					COUNT(DISTINCT CASE WHEN state = 'ISSUED' THEN id ELSE NULL END) AS mint_count,
					MIN(created_time) as min_created_time
				FROM 
					mint_quote
					${where_clause}
				GROUP BY 
					time_group, unit
			),
			melt_data AS (
				SELECT 
					${time_group_sql} AS time_group,
					unit,
					SUM(CASE WHEN state = 'PAID' THEN amount ELSE 0 END) AS melt_amount,
					COUNT(DISTINCT CASE WHEN state = 'PAID' THEN id ELSE NULL END) AS melt_count,
					MIN(created_time) as min_created_time
				FROM 
					melt_quote
					${where_clause}
				GROUP BY 
					time_group, unit
			)
			SELECT 
				COALESCE(m.time_group, l.time_group) AS time_group,
				COALESCE(m.unit, l.unit) AS unit,
				COALESCE(m.mint_amount, 0) - COALESCE(l.melt_amount, 0) AS amount,
				COALESCE(m.mint_count, 0) + COALESCE(l.melt_count, 0) AS operation_count,
				COALESCE(m.min_created_time, l.min_created_time) AS min_created_time
			FROM 
				mint_data m
				LEFT JOIN melt_data l ON m.time_group = l.time_group AND m.unit = l.unit
			UNION ALL
			SELECT 
				l.time_group,
				l.unit,
				-l.melt_amount AS amount,
				l.melt_count AS operation_count,
				l.min_created_time
			FROM 
				melt_data l
				LEFT JOIN mint_data m ON l.time_group = m.time_group AND l.unit = m.unit
			WHERE 
				m.time_group IS NULL
			ORDER BY 
				min_created_time;`;

		return new Promise((resolve, reject) => {
			db.all(sqlite_sql, [...params, ...params], (err, rows: any[]) => {
				if (err) return reject(err);

				const result = rows.map((row) => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone,
					});
					return {
						unit: row.unit,
						amount: row.amount,
						created_time: timestamp,
						operation_count: row.operation_count,
					};
				});

				resolve(result);
			});
		});
	}

	public async getMintAnalyticsMints(db: sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(CASE WHEN state = 'ISSUED' THEN amount ELSE 0 END) AS amount,
				COUNT(DISTINCT CASE WHEN state = 'ISSUED' THEN id ELSE NULL END) AS operation_count,
				MIN(created_time) as min_created_time
			FROM 
				mint_quote
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY 
				min_created_time;`;

		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);

				const result = rows.map((row) => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone,
					});
					return {
						unit: row.unit,
						amount: row.amount,
						created_time: timestamp,
						operation_count: row.operation_count,
					};
				});

				resolve(result);
			});
		});
	}

	public async getMintAnalyticsMelts(db: sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(CASE WHEN state = 'PAID' THEN amount ELSE 0 END) AS amount,
				COUNT(DISTINCT CASE WHEN state = 'PAID' THEN id ELSE NULL END) AS operation_count,
				MIN(created_time) as min_created_time
			FROM 
				melt_quote
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY 
				min_created_time;`;

		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);

				const result = rows.map((row) => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone,
					});
					return {
						unit: row.unit,
						amount: row.amount,
						created_time: timestamp,
						operation_count: row.operation_count,
					};
				});

				resolve(result);
			});
		});
	}

	public async getMintAnalyticsTransfers(db: sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
		});
		where_conditions.push('quote_id IS NULL');
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(amount) AS amount,
				COUNT(DISTINCT secret) AS operation_count,
				MIN(created_time) as min_created_time
			FROM 
				proof
				LEFT JOIN keyset k ON k.id = proof.keyset_id
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY
				min_created_time;`;

		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);

				const result = rows.map((row) => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone,
					});
					return {
						unit: row.unit,
						amount: row.amount,
						created_time: timestamp,
						operation_count: row.operation_count,
					};
				});

				resolve(result);
			});
		});
	}

	public async getMintAnalyticsKeysets(db: sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintKeysetsAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'keyset_id',
		});

		const sql = `
			WITH issued AS (
				SELECT 
					${time_group_sql} AS time_group,
					keyset_id,
					SUM(amount) AS issued_amount,
					MIN(created_time) as min_created_time
				FROM blind_signature
				${where_clause}
				GROUP BY time_group, keyset_id
			),
			redeemed AS (
				SELECT 
					${time_group_sql} AS time_group,
					keyset_id,
					SUM(amount) AS redeemed_amount,
					MIN(created_time) as min_created_time
				FROM proof
				${where_clause}
				AND state = 'SPENT'
				GROUP BY time_group, keyset_id
			)
			SELECT 
				COALESCE(i.time_group, r.time_group) AS time_group,
				COALESCE(i.keyset_id, r.keyset_id) AS keyset_id,
				COALESCE(i.issued_amount, 0) - COALESCE(r.redeemed_amount, 0) AS amount,
				COALESCE(i.min_created_time, r.min_created_time) AS min_created_time
			FROM issued i
			FULL OUTER JOIN redeemed r 
				ON i.time_group = r.time_group 
				AND i.keyset_id = r.keyset_id
			ORDER BY min_created_time;
		`;

		return new Promise((resolve, reject) => {
			db.all(sql, [...params, ...params], (err, rows: any[]) => {
				if (err) return reject(err);

				const result = rows.map((row) => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone,
					});
					return {
						keyset_id: row.keyset_id,
						amount: row.amount,
						created_time: timestamp,
					};
				});

				resolve(result);
			});
		});
	}
}
