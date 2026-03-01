/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Local Dependencies */
import {CashuMintAnalyticsArgs} from './cashumintdb.interfaces';
import {CashuMintDatabase, CashuMintKeysetCount} from './cashumintdb.types';
import {MintDatabaseType} from './cashumintdb.enums';

interface BuildQueryOptions {
	db_type: MintDatabaseType;
	table_name: string;
	args?: Record<string, any>;
	field_mappings?: Record<string, string>;
	select_statement?: string;
	group_by?: string;
	time_is_epoch_seconds?: boolean;
}

/**
 * Builds a dynamic SQL query with parameters based on provided arguments
 * @returns Object containing SQL query string and parameters array
 */
export function buildDynamicQuery(options: BuildQueryOptions): {sql: string; params: any[]} {
	const {db_type, table_name, args, field_mappings, select_statement, group_by, time_is_epoch_seconds} = options;
	let sql = select_statement || `SELECT * FROM ${table_name}`;
	const conditions: string[] = [];
	const params: any[] = [];
	const page_size = args?.page_size || 500;
	const page = args?.page || 1;
	const offset = (page - 1) * page_size;

	if (args && field_mappings) {
		Object.entries(args).forEach(([arg_key, arg_value]) => {
			processQueryArgument(db_type, arg_key, arg_value, field_mappings, conditions, params, time_is_epoch_seconds);
		});
	}

	if (conditions.length > 0) sql += ` WHERE ${conditions.join(' AND ')}`;
	if (group_by) sql += ` GROUP BY ${group_by}`;
	sql += ` ORDER BY ${field_mappings?.date_start || 'created_time'} DESC`;
	sql += ` LIMIT ${page_size}`;
	if (offset > 0) sql += ` OFFSET ${offset}`;
	return {sql: sql + ';', params};
}

/**
 * Builds a count SQL query with parameters based on provided arguments
 * @returns Object containing SQL query string and parameters array
 */
export function buildCountQuery(options: BuildQueryOptions): {sql: string; params: any[]} {
	const {db_type, table_name, args, field_mappings, select_statement, group_by, time_is_epoch_seconds} = options;
	let sql = select_statement || `SELECT COUNT(*) AS count FROM ${table_name}`;
	const conditions: string[] = [];
	const params: any[] = [];
	if (args && field_mappings) {
		Object.entries(args).forEach(([arg_key, arg_value]) => {
			processQueryArgument(db_type, arg_key, arg_value, field_mappings, conditions, params, time_is_epoch_seconds);
		});
	}
	if (conditions.length > 0) sql += ` WHERE ${conditions.join(' AND ')}`;
	if (group_by) sql += ` GROUP BY ${group_by}`;
	return {sql: sql + ';', params};
}

/**
 * Processes a single argument and adds appropriate conditions and parameters
 * @param argKey The argument key
 * @param argValue The argument value
 * @param fieldMappings Maps argument fields to database columns
 * @param conditions Array of SQL conditions to append to
 * @param params Array of parameters to append to
 * @returns void - modifies conditions and params arrays in place
 */
export function processQueryArgument(
	db_type: MintDatabaseType,
	arg_key: string,
	arg_value: any,
	field_mappings: Record<string, string>,
	conditions: string[],
	params: any[],
	time_is_epoch_seconds?: boolean,
): void {
	if (arg_value === undefined) return;
	if (!(arg_key in field_mappings)) return;

	const db_field = field_mappings[arg_key];

	// Handle array values (IN clause)
	if (Array.isArray(arg_value) && arg_value.length > 0) {
		conditions.push(`${db_field} IN (${arg_value.map(() => '?').join(', ')})`);
		params.push(...arg_value);
	}
	// Handle date range start
	else if (arg_key === 'date_start') {
		conditions.push(`${db_field} >= ?`);
		params.push(time_is_epoch_seconds ? arg_value : convertDateArgument(arg_value, db_type));
	}
	// Handle date range end
	else if (arg_key === 'date_end') {
		conditions.push(`${db_field} <= ?`);
		params.push(time_is_epoch_seconds ? arg_value : convertDateArgument(arg_value, db_type));
	}
	// Handle regular equality comparison
	else if (arg_value !== null) {
		conditions.push(`${db_field} = ?`);
		params.push(arg_value);
	}
}

export function getAnalyticsConditions({
	args,
	time_column,
	db_type,
	time_is_epoch_seconds,
}: {
	args: CashuMintAnalyticsArgs;
	time_column: string;
	db_type: MintDatabaseType;
	time_is_epoch_seconds?: boolean;
}): {
	where_conditions: string[];
	params: any[];
} {
	const where_conditions = [];
	const params = [];
	if (args?.date_start) {
		if (db_type === MintDatabaseType.sqlite) {
			where_conditions.push(`${time_column} >= ?`);
			params.push(convertDateArgument(args.date_start, db_type));
		} else {
			const time_expr = time_is_epoch_seconds ? `to_timestamp(${time_column})` : `${time_column}`;
			where_conditions.push(`${time_expr} >= to_timestamp(?)`);
			params.push(args.date_start);
		}
	}
	if (args?.date_end) {
		if (db_type === MintDatabaseType.sqlite) {
			where_conditions.push(`${time_column} <= ?`);
			params.push(convertDateArgument(args.date_end, db_type));
		} else {
			const time_expr = time_is_epoch_seconds ? `to_timestamp(${time_column})` : `${time_column}`;
			where_conditions.push(`${time_expr} <= to_timestamp(?)`);
			params.push(args.date_end);
		}
	}
	if (args?.units && args.units.length > 0) {
		const unit_placeholders = args.units.map(() => '?').join(',');
		where_conditions.push(`unit IN (${unit_placeholders})`);
		params.push(...args.units);
	}
	return {where_conditions, params};
}

function convertDateArgument(date_arg: number, db_type: MintDatabaseType): number | string {
	if (db_type === MintDatabaseType.sqlite) return date_arg;
	return DateTime.fromSeconds(date_arg).toFormat('yyyy-MM-dd HH:mm:ss');
}

export function getAnalyticsTimeGroupSql({
	interval,
	timezone,
	time_column,
	group_by,
	db_type,
	time_is_epoch_seconds,
}: {
	interval: CashuMintAnalyticsArgs['interval'];
	timezone: CashuMintAnalyticsArgs['timezone'];
	time_column: string;
	group_by: string;
	db_type: MintDatabaseType;
	time_is_epoch_seconds?: boolean;
}): string {
	if (db_type === MintDatabaseType.sqlite) {
		return getAnalyticsTimeGroupSqlSqlite({interval, time_column, group_by, timezone});
	} else {
		return getAnalyticsTimeGroupSqlPostgres({interval, time_column, group_by, timezone, time_is_epoch_seconds});
	}
}

function getAnalyticsTimeGroupSqlSqlite({
	interval,
	time_column,
	group_by,
	timezone,
}: {
	interval: CashuMintAnalyticsArgs['interval'];
	time_column: string;
	group_by: string;
	timezone: string;
}): string {
	const now = DateTime.now().setZone(timezone);
	const offset_seconds = now.offset * 60; // Convert minutes to seconds
	if (interval === 'day') {
		return `strftime('%Y-%m-%d', datetime(${time_column} + ${offset_seconds}, 'unixepoch'))`;
	}
	if (interval === 'week') {
		return `strftime('%Y-%m-%d', datetime(${time_column} + ${offset_seconds} - (strftime('%w', datetime(${time_column} + ${offset_seconds}, 'unixepoch')) - 1) * 86400, 'unixepoch'))`;
	}
	if (interval === 'month') {
		return `strftime('%Y-%m-01', datetime(${time_column} + ${offset_seconds}, 'unixepoch'))`;
	}
	return `${group_by}`;
}

function getAnalyticsTimeGroupSqlPostgres({
	interval,
	time_column,
	group_by,
	timezone,
	time_is_epoch_seconds,
}: {
	interval: CashuMintAnalyticsArgs['interval'];
	time_column: string;
	group_by: string;
	timezone: string;
	time_is_epoch_seconds?: boolean;
}): string {
	const base_ts = time_is_epoch_seconds ? `to_timestamp(${time_column})` : `${time_column}`;
	const timezone_expr = `${base_ts} AT TIME ZONE 'UTC' AT TIME ZONE '${timezone}'`;
	if (interval === 'day') {
		return `to_char(${timezone_expr}, 'YYYY-MM-DD')`;
	}
	if (interval === 'week') {
		return `to_char(date_trunc('week', ${timezone_expr}), 'YYYY-MM-DD')`;
	}
	if (interval === 'month') {
		return `to_char(date_trunc('month', ${timezone_expr}), 'YYYY-MM-01')`;
	}
	return `${group_by}`;
}

export function getAnalyticsTimeGroupStamp({
	min_created_time,
	time_group,
	interval,
	timezone,
}: {
	min_created_time: number | Date;
	time_group: string;
	interval: CashuMintAnalyticsArgs['interval'];
	timezone: CashuMintAnalyticsArgs['timezone'];
}): number {
	if (interval === 'custom') return convertDateToUnixTimestamp(min_created_time);
	const datetime = DateTime.fromFormat(time_group, 'yyyy-MM-dd', {zone: timezone}).startOf('day');
	return Math.floor(datetime.toSeconds());
}

/**
 * Merges proof count and promise count rows by keyset ID
 * @param proof_rows - array of keyset id + count from proof query
 * @param promise_rows - array of keyset id + count from promise query
 * @returns merged CashuMintKeysetCount array
 */
export function mergeKeysetCounts(
	proof_rows: {id: string; count: number}[],
	promise_rows: {id: string; count: number}[],
): CashuMintKeysetCount[] {
	const proof_map = new Map(proof_rows.map((r) => [r.id, r.count]));
	const promise_map = new Map(promise_rows.map((r) => [r.id, r.count]));
	const keyset_ids = Array.from(new Set(proof_rows.map((r) => r.id).concat(promise_rows.map((r) => r.id))));
	return keyset_ids.map((id) => ({
		id,
		proof_count: proof_map.get(id) ?? 0,
		promise_count: promise_map.get(id) ?? 0,
	}));
}

export async function queryRows<T>(client: CashuMintDatabase, sql: string, params?: any[]): Promise<T[]> {
	if (client.type === MintDatabaseType.sqlite) return client.database.prepare(sql).all(params) as T[];
	const pg_sql = convertSqlToType(sql, MintDatabaseType.postgres);
	return client.database.query(pg_sql, params).then((res) => res.rows as T[]);
}

export async function queryRow<T>(client: CashuMintDatabase, sql: string, params?: any[]): Promise<T> {
	if (client.type === MintDatabaseType.sqlite) return client.database.prepare(sql).get(params) as T;
	const pg_sql = convertSqlToType(sql, MintDatabaseType.postgres);
	return client.database.query(pg_sql, params).then((res) => res.rows[0] as T);
}

/**
 * Converts SQLite-style placeholders (?) to PostgreSQL-style placeholders ($1, $2, etc.)
 * and SQLite-specific functions to PostgreSQL equivalents
 * @param sql The SQL query string
 * @param db_type The database type to determine conversions
 * @returns The converted SQL query string
 */
export function convertSqlToType(sql: string, db_type: MintDatabaseType): string {
	if (db_type === MintDatabaseType.sqlite) return sql;
	let converted_sql = sql.replace(/json_group_array\(([^)]+)\)/g, 'json_agg($1)');
	let placeholder_count = 0;
	converted_sql = converted_sql.replace(/\?/g, () => {
		placeholder_count++;
		return `$${placeholder_count}`;
	});
	return converted_sql;
}

/**
 * Converts a date to a Unix timestamp
 * @param date_arg The date to convert
 * @returns The Unix timestamp in seconds
 */
export function convertDateToUnixTimestamp(date_arg: number | Date): number | null {
	if (typeof date_arg === 'number') return date_arg;
	if (date_arg instanceof Date) return DateTime.fromJSDate(date_arg).toSeconds();
	return null;
}

export function extractRequestString(raw_request?: string | null): string | null {
	if (!raw_request) return null;
	const trimmed = raw_request.trim();
	if (!trimmed.startsWith('{')) return trimmed;

	try {
		const json: any = JSON.parse(trimmed);
		const offer_paths = ['offer', 'Bolt12.offer', 'bolt12.offer'];
		const invoice_paths = ['bolt11', 'Bolt11', 'Bolt11.bolt11', 'invoice'];
		const offer = findFirstString(json, offer_paths);
		if (offer) return offer;
		const bolt11 = findFirstString(json, invoice_paths);
		return bolt11 || trimmed;
	} catch {
		return trimmed;
	}
}

function findFirstString(obj: any, paths: string[]): string | undefined {
	for (const path of paths) {
		const val = getStringByPath(obj, path);
		if (val) return val;
	}
	return undefined;
}

function getStringByPath(obj: any, dot_path: string): string | undefined {
	let cur: any = obj;
	for (const key of dot_path.split('.')) {
		if (cur == null || typeof cur !== 'object') return undefined;
		cur = cur[key];
	}
	return typeof cur === 'string' && cur ? cur : undefined;
}
