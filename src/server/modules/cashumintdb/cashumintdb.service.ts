/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
const sqlite3d = require('sqlite3').verbose();
import { DateTime } from 'luxon';
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
import {
	buildDynamicQuery,
	getAnalyticsTimeGroupStamp,
	getAnalyticsConditions,
	getAnalyticsTimeGroupSql,
} from './cashumintdb.helpers';
import { MintAnalyticsInterval } from './cashumintdb.enums';

@Injectable()
export class CashuMintDatabaseService {

	constructor(
		private configService: ConfigService,
	) {}

	public getMintDatabase() : sqlite3.Database {
		return new sqlite3d.Database(this.configService.get('cashu.database'));
	}

	public async getMintBalances(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_issued;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_redeemed;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintKeysets(db:sqlite3.Database) : Promise<CashuMintKeyset[]> {
		const sql = 'SELECT * FROM keysets;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintKeyset[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintDatabaseVersions(db:sqlite3.Database) : Promise<CashuMintDatabaseVersion[]> {
		const sql = 'SELECT * FROM dbversions;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintDatabaseVersion[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintMeltQuotes(db:sqlite3.Database) : Promise<CashuMintMeltQuote[]> {
		const sql = 'SELECT * FROM melt_quotes;';
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
			date_start: 'created_time',
			date_end: 'created_time',
			status: 'status'
		};
		const { sql, params } = buildDynamicQuery('mint_quotes', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:CashuMintMintQuote[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
    }

	public async getMintPromises(db:sqlite3.Database, args?: CashuMintPromisesArgs) : Promise<CashuMintPromise[]> {
		const field_mappings = {
			id_keysets: 'id',
			date_start: 'created',
			date_end: 'created'
		};
		const { sql, params } = buildDynamicQuery('promises', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:CashuMintPromise[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintProofsPending(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		const sql = 'SELECT * FROM proofs_pending;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintProof[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintProofsUsed(db:sqlite3.Database) : Promise<CashuMintProof[]> {
		const sql = 'SELECT * FROM proofs_used;';
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
		const { where_conditions, params } = getAnalyticsConditions(args);
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			table_name: '',
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
		const { where_conditions, params } = getAnalyticsConditions(args);
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			table_name: 'mq.',
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				mq.unit,
				SUM(CASE WHEN mq.state = 'ISSUED' THEN mq.amount ELSE 0 END) AS amount,
				COUNT(DISTINCT CASE WHEN mq.state = 'ISSUED' THEN mq.quote ELSE NULL END) AS operation_count,
				MIN(mq.created_time) as min_created_time
			FROM 
				mint_quotes mq
				${where_clause}
			GROUP BY 
				time_group, mq.unit
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
		const { where_conditions, params } = getAnalyticsConditions(args);
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			table_name: 'lq.',
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				lq.unit,
				SUM(CASE WHEN lq.state = 'PAID' THEN lq.amount ELSE 0 END) AS amount,
				COUNT(DISTINCT CASE WHEN lq.state = 'PAID' THEN lq.quote ELSE NULL END) AS operation_count,
				MIN(lq.created_time) as min_created_time
			FROM 
				melt_quotes lq
				${where_clause}
			GROUP BY 
				time_group, lq.unit
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