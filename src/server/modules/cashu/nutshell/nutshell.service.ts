/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Vendor Dependencies */
import sqlite3 from "sqlite3";
/* Native Dependencies */
import { 
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
	CashuMintProofGroup,
	CashuMintPromiseGroup,
	CashuMintCount,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import { 
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintMeltQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
	getAnalyticsTimeGroupStamp,
	getAnalyticsConditions,
	getAnalyticsTimeGroupSql,
	buildCountQuery,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';
import { MintAnalyticsInterval } from '@server/modules/cashu/mintdb/cashumintdb.enums';
/* Local Dependencies */
import { NutshellMintMintQuote, NutshellMintMeltQuote } from './nutshell.types';

@Injectable()
export class NutshellService {

	constructor() {}

	public async getMintBalances(db:sqlite3.Database, keyset_id?: string) : Promise<CashuMintBalance[]> {
		const where_clause = keyset_id ? `WHERE keyset = ?` : '';
		const sql = `SELECT * FROM balance ${where_clause};`;
		const params = keyset_id ? [keyset_id] : [];
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:CashuMintBalance[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesIssued(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_issued;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintBalancesRedeemed(db:sqlite3.Database) : Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_redeemed;';
		return new Promise((resolve, reject) => {
			db.all(sql, (err, rows:CashuMintBalance[]) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	public async getMintKeysets(db:sqlite3.Database) : Promise<CashuMintKeyset[]> {
		const sql = 'SELECT * FROM keysets WHERE unit != ?;';
		return new Promise((resolve, reject) => {
			db.all(sql, ['auth'], (err, rows:CashuMintKeyset[]) => {
				if (err) return reject(err);
				rows.forEach(row => {
					const match = row.derivation_path?.match(/\/(\d+)'?$/);
					row.derivation_path_index = match ? parseInt(match[1], 10) : null;
				});
				resolve(rows);
			});
		});
	}

	public async getMintMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<CashuMintMintQuote[]> {
		const field_mappings = {
			unit: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			status: 'state'
		};
		const { sql, params } = buildDynamicQuery('mint_quotes', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:NutshellMintMintQuote[]) => {
				if (err) return reject(err);
				const cashu_quote = (row: NutshellMintMintQuote): CashuMintMintQuote => ({
					id: row.quote,
					request_lookup_id: row.checking_id,
					issued_time: (row.state === 'ISSUED') ? row.paid_time : null,
					...row
				});
				resolve(rows.map(cashu_quote));
			});
		});
    }

	public async getMintMeltQuotes(db:sqlite3.Database, args?: CashuMintMeltQuotesArgs) : Promise<CashuMintMeltQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const { sql, params } = buildDynamicQuery('melt_quotes', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows:NutshellMintMeltQuote[]) => {
				if (err) return reject(err);
				const cashu_quote = (row: NutshellMintMeltQuote): CashuMintMeltQuote => ({
					id: row.quote,
					request_lookup_id: row.checking_id,
					paid_time: row.paid_time,
					payment_preimage: null,
					msat_to_pay: null,
					...row
				});
				resolve(rows.map(cashu_quote));
			});
		});
	}

	public async getMintProofGroups(db: sqlite3.Database, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'p.id',
			date_start: 'p.created',
			date_end: 'p.created',
		};
		
		const select_statement = `
			SELECT 
				p.created,
				p.id,
				k.unit,
				json_group_array(p.amount) as amounts
			FROM proofs_used p
			LEFT JOIN keysets k ON k.id = p.id`;
		
		const group_by = 'p.created, k.unit, p.id';
		
		const { sql, params } = buildDynamicQuery(
			'proofs_used', 
			args, 
			field_mappings, 
			select_statement, 
			group_by
		);
		
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);
				const groups = {};
				rows.forEach(row => {
					const key = `${row.created}_${row.unit}`;
					if (!groups[key]) {
						groups[key] = {
							created_time: row.created,
							unit: row.unit,
							state: 'SPENT',
							keysets: [],
							amounts: []
						};
					}
					groups[key].keysets.push(row.id);
					groups[key].amounts.push(JSON.parse(row.amounts));
				});
				
				const proof_groups: CashuMintProofGroup[] = Object.values(groups).map((group: any) => ({
					amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
					created_time: group.created_time,
					keyset_ids: group.keysets,
					unit: group.unit,
					state: group.state,
					amounts: group.amounts
				}));				
				resolve(proof_groups);
			});
		});
	}

	public async getMintPromiseGroups(db: sqlite3.Database, args?: CashuMintPromiseArgs): Promise<CashuMintPromiseGroup[]> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'p.id',
			date_start: 'p.created',
			date_end: 'p.created',
		};

		const select_statement = `
			SELECT 
				p.created,
				p.id,
				k.unit,
				json_group_array(p.amount) as amounts
			FROM promises p
			LEFT JOIN keysets k ON k.id = p.id`;
		
		const group_by = 'p.created, k.unit, p.id';
		
		const { sql, params } = buildDynamicQuery(
			'promises', 
			args, 
			field_mappings, 
			select_statement, 
			group_by
		);
		
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows: any[]) => {
				if (err) return reject(err);
				const groups = {};
				rows.forEach(row => {
					const key = `${row.created}_${row.unit}`;
					if (!groups[key]) {
						groups[key] = {
							created_time: row.created,
							unit: row.unit,
							keysets: [],
							amounts: []
						};
					}
					groups[key].keysets.push(row.id);
					groups[key].amounts.push(JSON.parse(row.amounts));
				});
				
				const promise_groups: CashuMintPromiseGroup[] = Object.values(groups).map((group: any) => ({
					amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
					created_time: group.created_time,
					keyset_ids: group.keysets,
					unit: group.unit,
					amounts: group.amounts
				}));				
				resolve(promise_groups);
			});
		});
	}

	public async getMintCountMeltQuotes(db:sqlite3.Database, args?: CashuMintMeltQuotesArgs) : Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const { sql, params } = buildCountQuery('melt_quotes', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.get(sql, params, (err, row:CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public async getMintCountMintQuotes(db:sqlite3.Database, args?: CashuMintMintQuotesArgs) : Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const { sql, params } = buildCountQuery('mint_quotes', args, field_mappings);
		return new Promise((resolve, reject) => {
			db.get(sql, params, (err, row:CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public async getMintCountProofGroups(db:sqlite3.Database, args?: CashuMintProofsArgs) : Promise<number> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'p.id',
			date_start: 'p.created',
			date_end: 'p.created',
		};
		
		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT 
					p.created,
					p.id,
					k.unit
				FROM proofs_used p
				LEFT JOIN keysets k ON k.id = p.id`;
		
		const group_by = 'p.created, k.unit';
		const { sql, params } = buildCountQuery('proofs_used', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');
		
		return new Promise((resolve, reject) => {
			db.get(final_sql, params, (err, row:CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
			});
		});
	}

	public async getMintCountPromiseGroups(db:sqlite3.Database, args?: CashuMintPromiseArgs) : Promise<number> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'p.id',
			date_start: 'p.created',
			date_end: 'p.created',
		};

		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT 
					p.created,
					p.id,
					k.unit
				FROM promises p
				LEFT JOIN keysets k ON k.id = p.id`;
		
		const group_by = 'p.created, k.unit';
		const { sql, params } = buildCountQuery('promises', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');
		
		return new Promise((resolve, reject) => {
			db.get(final_sql, params, (err, row:CashuMintCount) => {
				if (err) return reject(err);
				resolve(row.count);
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
			time_column: 'created_time',
			group_by: 'unit'
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
			time_column: 'created_time',
			group_by: 'unit'
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
			time_column: 'created_time',
			group_by: 'unit'
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
			time_column: 'created',
			group_by: 'unit'
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

	public async getMintAnalyticsKeysets(db: sqlite3.Database, args?: CashuMintAnalyticsArgs): Promise<CashuMintKeysetsAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const { where_conditions, params } = getAnalyticsConditions({
			args: args,
			time_column: 'created'
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created',
			group_by: 'id'
		});
	
		const sql = `
			WITH issued AS (
				SELECT 
					${time_group_sql} AS time_group,
					id,
					SUM(amount) AS issued_amount,
					MIN(created) as min_created_time
				FROM promises
				${where_clause}
				GROUP BY time_group, id
			),
			redeemed AS (
				SELECT 
					${time_group_sql} AS time_group,
					id,
					SUM(amount) AS redeemed_amount,
					MIN(created) as min_created_time
				FROM proofs_used
				${where_clause}
				GROUP BY time_group, id
			)
			SELECT 
				COALESCE(i.time_group, r.time_group) AS time_group,
				COALESCE(i.id, r.id) AS keyset_id,
				COALESCE(i.issued_amount, 0) - COALESCE(r.redeemed_amount, 0) AS amount,
				COALESCE(i.min_created_time, r.min_created_time) AS min_created_time
			FROM issued i
			FULL OUTER JOIN redeemed r 
				ON i.time_group = r.time_group 
				AND i.id = r.id
			ORDER BY min_created_time;
		`;
	
		return new Promise((resolve, reject) => {
			db.all(sql, [...params, ...params], (err, rows: any[]) => {
				if (err) return reject(err);
						
				const result = rows.map(row => {
					const timestamp = getAnalyticsTimeGroupStamp({
						min_created_time: row.min_created_time,
						time_group: row.time_group,
						interval: interval,
						timezone: timezone
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