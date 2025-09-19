/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Native Dependencies */
import {
	CashuMintDatabase,
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
	CashuMintProofGroup,
	CashuMintPromiseGroup,
	CashuMintCount,
	CashuMintFee,
	CashuMintKeysetProofCount,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {
	CashuMintAnalyticsArgs,
	CashuMintMintQuotesArgs,
	CashuMintMeltQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
	CashuMintKeysetProofsArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
	getAnalyticsTimeGroupStamp,
	getAnalyticsConditions,
	getAnalyticsTimeGroupSql,
	buildCountQuery,
	convertDateToUnixTimestamp,
	queryRows,
	queryRow,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';
import {MintAnalyticsInterval} from '@server/modules/cashu/mintdb/cashumintdb.enums';
import {MintPaymentMethod} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {
	NutshellMintMintQuote,
	NutshellMintMeltQuote,
	NutshellMintEcash,
	NutshellMintAnalytics,
	NutshellMintKeysetsAnalytics,
} from './nutshell.types';

@Injectable()
export class NutshellService {
	private readonly logger = new Logger(NutshellService.name);

	constructor(
		private configService: ConfigService,
		private credentialService: CredentialService,
	) {}

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
			const proto_path = path.join(process.cwd(), 'proto/nutshell/management.proto');
			const package_definition = protoLoader.loadSync(proto_path, {
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true,
			});
			const mint_proto: any = grpc.loadPackageDefinition(package_definition).cashu;
			const key_content = this.credentialService.loadPemOrPath(rpc_key);
			const cert_content = this.credentialService.loadPemOrPath(rpc_cert);
			const ca_content = rpc_ca ? this.credentialService.loadPemOrPath(rpc_ca) : undefined;
			const ssl_credentials = grpc.credentials.createSsl(ca_content, key_content, cert_content);

			let channel_options: Record<string, any> | undefined = undefined;
			if (rpc_host?.includes('host.docker.internal')) {
				channel_options = {
					'grpc.ssl_target_name_override': 'localhost',
					'grpc.default_authority': 'localhost',
				};
			}

			this.logger.log('Mint gRPC client initialized with TLS certificate authentication');
			return new mint_proto.Mint(rpc_url, ssl_credentials, channel_options);
		} catch (error) {
			this.logger.error(`Failed to initialize gRPC client: ${error.message}`);
		}
	}

	public async getMintBalances(client: CashuMintDatabase, keyset_id?: string): Promise<CashuMintBalance[]> {
		const where_clause = keyset_id ? `WHERE keyset = ?` : '';
		const sql = `SELECT * FROM balance ${where_clause};`;
		const params = keyset_id ? [keyset_id] : [];
		try {
			return queryRows<CashuMintBalance>(client, sql, params);
		} catch (err) {
			throw err;
		}
	}

	public async getMintBalancesIssued(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_issued;';
		try {
			return queryRows<CashuMintBalance>(client, sql);
		} catch (err) {
			throw err;
		}
	}

	public async getMintBalancesRedeemed(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_redeemed;';
		try {
			return queryRows<CashuMintBalance>(client, sql);
		} catch (err) {
			throw err;
		}
	}

	public async getMintKeysets(client: CashuMintDatabase): Promise<CashuMintKeyset[]> {
		const sql = 'SELECT * FROM keysets WHERE unit != ?;';
		try {
			const rows = await queryRows<CashuMintKeyset>(client, sql, ['auth']);
			return rows.map((row) => ({
				...row,
				valid_from: convertDateToUnixTimestamp(row.valid_from),
				valid_to: convertDateToUnixTimestamp(row.valid_to),
				derivation_path_index: row.derivation_path?.match(/\/(\d+)'?$/)?.[1]
					? parseInt(row.derivation_path.match(/\/(\d+)'?$/)[1], 10)
					: null,
			}));
		} catch (err) {
			this.logger.error(`Error fetching mint keysets: ${err}`);
			throw err;
		}
	}

	public async getMintMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<CashuMintMintQuote[]> {
		const field_mappings = {
			unit: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildDynamicQuery(client.type, 'mint_quotes', args, field_mappings);
		try {
			const rows = await queryRows<NutshellMintMintQuote>(client, sql, params);
			return rows.map((row) => ({
				...row,
				id: row.quote,
				request_lookup_id: row.checking_id,
				issued_time: row.state === 'ISSUED' ? convertDateToUnixTimestamp(row.paid_time) : null,
				created_time: convertDateToUnixTimestamp(row.created_time),
				paid_time: convertDateToUnixTimestamp(row.paid_time),
				amount_paid: row.amount,
				amount_issued: row.amount,
				payment_method: MintPaymentMethod.bolt11,
			}));
		} catch (err) {
			throw err;
		}
	}

	public async getMintMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<CashuMintMeltQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildDynamicQuery(client.type, 'melt_quotes', args, field_mappings);
		try {
			const rows = await queryRows<NutshellMintMeltQuote>(client, sql, params);
			return rows.map((row) => ({
				...row,
				id: row.quote,
				request_lookup_id: row.checking_id,
				paid_time: convertDateToUnixTimestamp(row.paid_time),
				created_time: convertDateToUnixTimestamp(row.created_time),
				payment_preimage: null,
				msat_to_pay: null,
				payment_method: MintPaymentMethod.bolt11,
			}));
		} catch (err) {
			throw err;
		}
	}

	public async getMintProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
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
		const {sql, params} = buildDynamicQuery(client.type, 'proofs_used', args, field_mappings, select_statement, group_by);
		try {
			const rows = await queryRows<NutshellMintEcash>(client, sql, params);
			const groups = {};
			rows.forEach((row) => {
				const created_time = convertDateToUnixTimestamp(row.created);
				const key = `${created_time}_${row.unit}`;
				const amounts = Array.isArray(row.amounts) ? row.amounts : JSON.parse(row.amounts);
				if (!groups[key]) {
					groups[key] = {
						created_time: created_time,
						unit: row.unit,
						state: 'SPENT',
						keysets: [],
						amounts: [],
					};
				}
				groups[key].keysets.push(row.id);
				groups[key].amounts.push(amounts);
			});

			return Object.values(groups).map((group: any) => ({
				amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
				created_time: group.created_time,
				keyset_ids: group.keysets,
				unit: group.unit,
				state: group.state,
				amounts: group.amounts,
			}));
		} catch (err) {
			throw err;
		}
	}

	public async getMintPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<CashuMintPromiseGroup[]> {
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
		const {sql, params} = buildDynamicQuery(client.type, 'promises', args, field_mappings, select_statement, group_by);
		try {
			const rows = await queryRows<NutshellMintEcash>(client, sql, params);
			const groups = {};
			rows.forEach((row) => {
				const created_time = convertDateToUnixTimestamp(row.created);
				const key = `${created_time}_${row.unit}`;
				const amounts = Array.isArray(row.amounts) ? row.amounts : JSON.parse(row.amounts);
				if (!groups[key]) {
					groups[key] = {
						created_time: created_time,
						unit: row.unit,
						keysets: [],
						amounts: [],
					};
				}
				groups[key].keysets.push(row.id);
				groups[key].amounts.push(amounts);
			});

			return Object.values(groups).map((group: any) => ({
				amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
				created_time: group.created_time,
				keyset_ids: group.keysets,
				unit: group.unit,
				amounts: group.amounts,
			}));
		} catch (err) {
			throw err;
		}
	}

	public async getMintCountMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildCountQuery(client.type, 'melt_quotes', args, field_mappings);
		try {
			const row = await queryRow<CashuMintCount>(client, sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async getMintCountMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildCountQuery(client.type, 'mint_quotes', args, field_mappings);
		try {
			const row = await queryRow<CashuMintCount>(client, sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async getMintCountProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<number> {
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
					k.unit
				FROM proofs_used p
				LEFT JOIN keysets k ON k.id = p.id`;

		const group_by = 'p.created, k.unit';
		const {sql, params} = buildCountQuery(client.type, 'proofs_used', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');
		try {
			const row = await queryRow<CashuMintCount>(client, final_sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async getMintCountPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<number> {
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
					k.unit
				FROM promises p
				LEFT JOIN keysets k ON k.id = p.id`;

		const group_by = 'p.created, k.unit';
		const {sql, params} = buildCountQuery(client.type, 'promises', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');
		try {
			const row = await queryRow<CashuMintCount>(client, final_sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async getMintFees(client: CashuMintDatabase, limit: number = 1): Promise<CashuMintFee[]> {
		const sql = `SELECT * FROM balance_log ORDER BY time ASC LIMIT ?;`;
		try {
			return queryRows<CashuMintFee>(client, sql, [limit]);
		} catch (err) {
			throw err;
		}
	}

	public getMintKeysetProofCounts(client: CashuMintDatabase, args?: CashuMintKeysetProofsArgs): Promise<CashuMintKeysetProofCount[]> {
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created',
			db_type: client.type,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const sql = `SELECT 
			id,
			COUNT(*) AS count 
			FROM proofs_used
			${where_clause}
			GROUP BY id;`;
		try {
			return queryRows<CashuMintKeysetProofCount>(client, sql, [...params]);
		} catch (err) {
			throw err;
		}
	}

	/* Analytics */

	public async getMintAnalyticsBalances(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created',
			db_type: client.type,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created',
			group_by: 'unit',
			db_type: client.type,
		});

		const sql = `
			WITH issued AS (
				SELECT 
					${time_group_sql} AS time_group,
					k.unit,
					SUM(p.amount) AS issued_amount,
					COUNT(DISTINCT p.b_) AS issued_count,
					MIN(p.created) as min_created_time
				FROM promises p
				LEFT JOIN keysets k ON k.id = p.id
				${where_clause}
				GROUP BY time_group, k.unit
			),
			redeemed AS (
				SELECT 
					${time_group_sql} AS time_group,
					k.unit,
					SUM(pu.amount) AS redeemed_amount,
					COUNT(DISTINCT pu.secret) AS redeemed_count,
					MIN(pu.created) as min_created_time
				FROM proofs_used pu
				LEFT JOIN keysets k ON k.id = pu.id
				${where_clause}
				GROUP BY time_group, k.unit
			)
			SELECT 
				COALESCE(i.time_group, r.time_group) AS time_group,
				COALESCE(i.unit, r.unit) AS unit,
				COALESCE(i.issued_amount, 0) - COALESCE(r.redeemed_amount, 0) AS amount,
				COALESCE(i.issued_count, 0) + COALESCE(r.redeemed_count, 0) AS operation_count,
				COALESCE(i.min_created_time, r.min_created_time) AS min_created_time
			FROM issued i
			FULL OUTER JOIN redeemed r 
				ON i.time_group = r.time_group 
				AND i.unit = r.unit
			ORDER BY min_created_time;
		`;
		try {
			const rows = await queryRows<NutshellMintAnalytics>(client, sql, [...params, ...params]);
			return rows.map((row) => {
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
		} catch (err) {
			throw err;
		}
	}

	public async getMintAnalyticsMints(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
			db_type: client.type,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
			db_type: client.type,
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

		try {
			const rows = await queryRows<NutshellMintAnalytics>(client, sql, params);
			return rows.map((row) => {
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
		} catch (err) {
			throw err;
		}
	}

	public async getMintAnalyticsMelts(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
			db_type: client.type,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
			db_type: client.type,
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

		try {
			const rows = await queryRows<NutshellMintAnalytics>(client, sql, params);
			return rows.map((row) => {
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
		} catch (err) {
			throw err;
		}
	}

	public async getMintAnalyticsSwaps(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created',
			db_type: client.type,
		});
		where_conditions.push('melt_quote IS NULL');
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created',
			group_by: 'unit',
			db_type: client.type,
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

		try {
			const rows = await queryRows<NutshellMintAnalytics>(client, sql, params);
			return rows.map((row) => {
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
		} catch (err) {
			throw err;
		}
	}

	public async getMintAnalyticsFees(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'time',
			db_type: client.type,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'time',
			group_by: 'unit',
			db_type: client.type,
		});
		const fee_calculation_sql =
			args?.interval === MintAnalyticsInterval.custom ? `MAX(keyset_fees_paid)` : `(MAX(keyset_fees_paid) - MIN(keyset_fees_paid))`;

		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				${fee_calculation_sql} AS amount,
				COUNT(DISTINCT time) AS operation_count,
				MIN(time) as min_created_time
			FROM 
				balance_log
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY 
				min_created_time;`;

		try {
			const rows = await queryRows<NutshellMintAnalytics>(client, sql, params);
			return rows.map((row) => {
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
		} catch (err) {
			throw err;
		}
	}

	public async getMintAnalyticsKeysets(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintKeysetsAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created',
			db_type: client.type,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created',
			group_by: 'id',
			db_type: client.type,
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

		try {
			const rows = await queryRows<NutshellMintKeysetsAnalytics>(client, sql, [...params, ...params]);
			return rows.map((row) => {
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
		} catch (err) {
			throw err;
		}
	}
}
