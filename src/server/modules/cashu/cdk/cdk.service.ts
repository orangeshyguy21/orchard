/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Local Dependencies */
import { 
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintPromise,
	CashuMintProof,
	CashuMintAnalytics,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import { 
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintPromisesArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
	getAnalyticsTimeGroupStamp,
	getAnalyticsConditions,
	getAnalyticsTimeGroupSql,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';
import { MintAnalyticsInterval } from '@server/modules/cashu/mintdb/cashumintdb.enums';

@Injectable()
export class CdkService {

	constructor() {}

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

	public async getMintPromises(db:sqlite3.Database, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {
		const field_mappings = {
			id_keysets: 'keyset_id',
			date_start: 'created',
			date_end: 'created'
		};
		const { sql, params } = buildDynamicQuery('blind_signature', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:CashuMintPromise[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

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

  	/* Analytics */

  	public async getMintAnalyticsBalances(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const { where_conditions, params } = getAnalyticsConditions({
			args: args,
			time_column: 'created_time'
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time'
		});
		
		const sqlite_sql = `
			WITH mint_data AS (
				SELECT 
					${time_group_sql} AS time_group,
					unit,
					SUM(CASE WHEN state = 'ISSUED' THEN amount ELSE 0 END) AS mint_amount,
					COUNT(DISTINCT CASE WHEN state = 'ISSUED' THEN quote ELSE NULL END) AS mint_count,
					MIN(created_time) as min_created_time
				FROM 
					mint_quotes
					${where_clause}
				GROUP BY 
					time_group, unit
			),
			melt_data AS (
				SELECT 
					${time_group_sql} AS time_group,
					unit,
					SUM(CASE WHEN state = 'PAID' THEN amount ELSE 0 END) AS melt_amount,
					COUNT(DISTINCT CASE WHEN state = 'PAID' THEN quote ELSE NULL END) AS melt_count,
					MIN(created_time) as min_created_time
				FROM 
					melt_quotes
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
			db.all(sqlite_sql, [...params, ...params], (err, rows:any[]) => {
				if (err) return reject(err);
						
				const result = rows.map(row => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone
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

	public async getMintAnalyticsMints(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const { where_conditions, params } = getAnalyticsConditions({
			args: args,
			time_column: 'created_time'
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time'
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(CASE WHEN state = 'ISSUED' THEN amount ELSE 0 END) AS amount,
				COUNT(DISTINCT CASE WHEN state = 'ISSUED' THEN quote ELSE NULL END) AS operation_count,
				MIN(created_time) as min_created_time
			FROM 
				mint_quotes
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY 
				min_created_time;`;
    
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:any[]) => {
				if (err) return reject(err);
						
				const result = rows.map(row => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone
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

	public async getMintAnalyticsMelts(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const { where_conditions, params } = getAnalyticsConditions({
			args: args,
			time_column: 'created_time'
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time'
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(CASE WHEN state = 'PAID' THEN amount ELSE 0 END) AS amount,
				COUNT(DISTINCT CASE WHEN state = 'PAID' THEN quote ELSE NULL END) AS operation_count,
				MIN(created_time) as min_created_time
			FROM 
				melt_quotes
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY 
				min_created_time;`;
    
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:any[]) => {
				if (err) return reject(err);
						
				const result = rows.map(row => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone
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

	public async getMintAnalyticsTransfers(db:sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const { where_conditions, params } = getAnalyticsConditions({
			args: args,
			time_column: 'created'
		});
		where_conditions.push('melt_quote IS NULL');
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created'
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(amount) AS amount,
				COUNT(DISTINCT secret) AS operation_count,
				MIN(created) as min_created_time
			FROM 
				proofs_used
				LEFT JOIN keysets k ON k.id = proofs_used.id
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY
				min_created_time;`;
    
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:any[]) => {
				if (err) return reject(err);
						
				const result = rows.map(row => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone
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
}