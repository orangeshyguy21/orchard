/* Vendor Dependencies */
import { DateTime } from 'luxon';
/* Local Dependencies */
import { CashuMintAnalyticsArgs } from './cashumintdb.interfaces';

/**
 * Builds a dynamic SQL query with parameters based on provided arguments
 * @param table_name The database table to query
 * @param args Optional filtering arguments
 * @param field_mappings Maps argument fields to database columns
 * @param select_fields Optional fields to select (defaults to *)
 * @returns Object containing SQL query string and parameters array
 */
export function buildDynamicQuery(
    table_name: string, 
    args?: Record<string, any>,
    field_mappings?: Record<string, string>
) : {
	sql: string;
	params: any[]
} {
    let sql = `SELECT * FROM ${table_name}`;
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (args && field_mappings) {
        // Process each argument using the isolated method
        Object.entries(args).forEach(([arg_key, arg_value]) => {
            processQueryArgument(arg_key, arg_value, field_mappings, conditions, params);
        });
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    return { sql: sql + ';', params };
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
    arg_key: string,
    arg_value: any,
    field_mappings: Record<string, string>,
    conditions: string[],
    params: any[]
): void {	
	if( arg_value === undefined ) return;
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
		params.push(arg_value);
	}
	// Handle date range end
	else if (arg_key === 'date_end') {
		conditions.push(`${db_field} <= ?`);
		params.push(arg_value);
	}
	// Handle regular equality comparison
	else if (arg_value !== null) {
		conditions.push(`${db_field} = ?`);
		params.push(arg_value);
	}
}


export function getAnalyticsConditions(args:CashuMintAnalyticsArgs) : {
    where_conditions: string[];
    params: any[];
} {
    const where_conditions = [];
    const params = [];
    if (args?.date_start) {
        where_conditions.push("created_time >= ?");
        params.push(args.date_start);
    }
    if (args?.date_end) {
        where_conditions.push("created_time <= ?");
        params.push(args.date_end);
    }
    if (args?.units && args.units.length > 0) {
        const unit_placeholders = args.units.map(() => '?').join(',');
        where_conditions.push(`unit IN (${unit_placeholders})`);
        params.push(...args.units);
    }
    return { where_conditions, params };
}

export function getAnalyticsTimeGroupSql({
    interval,
    timezone,
    table_name,
}: {
    interval: CashuMintAnalyticsArgs['interval'];
    timezone: CashuMintAnalyticsArgs['timezone'];
    table_name: string;
}) : string {
    const now = DateTime.now().setZone(timezone);
	const offset_seconds = now.offset * 60; // Convert minutes to seconds
    if( interval === 'day' ) return `strftime('%Y-%m-%d', datetime( ${table_name}created_time + ${offset_seconds}, 'unixepoch'))`;
    if( interval === 'week' ) return `strftime('%Y-%m-%d', datetime( ${table_name}created_time + ${offset_seconds} - (strftime('%w', datetime( ${table_name}created_time + ${offset_seconds}, 'unixepoch')) - 1) * 86400, 'unixepoch'))`;
    if( interval === 'month' ) return `strftime('%Y-%m-01', datetime( ${table_name}created_time + ${offset_seconds}, 'unixepoch'))`;
    return `${table_name}unit`;
}

export function getAnalyticsTimeGroupStamp({
    min_created_time,
    time_group,
    interval,
    timezone
}: {
    min_created_time: number;
    time_group: string;
    interval: CashuMintAnalyticsArgs['interval'];
    timezone: CashuMintAnalyticsArgs['timezone'];
}) : number {
    if( interval === 'custom' ) return min_created_time;
    const datetime = DateTime.fromFormat(time_group, 'yyyy-MM-dd', {zone: timezone}).startOf('day');
    return Math.floor(datetime.toSeconds());
}
