/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
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
	CashuMintProofGroup,
	CashuMintPromiseGroup,
	CashuMintAnalytics,
	CashuMintKeysetsAnalytics,
	CashuMintCount,
	CashuMintKeysetProofCount,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {
	CashuMintMintQuotesArgs,
	CashuMintAnalyticsArgs,
	CashuMintMeltQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
	CashuMintKeysetProofsArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
	buildCountQuery,
	getAnalyticsTimeGroupStamp,
	getAnalyticsConditions,
	getAnalyticsTimeGroupSql,
	queryRows,
	queryRow,
	extractRequestString,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';
import {MintAnalyticsInterval, MintDatabaseType} from '@server/modules/cashu/mintdb/cashumintdb.enums';
/* Local Dependencies */
import {CdkMintProof, CdkMintPromise, CdkMintAnalytics, CdkMintKeysetsAnalytics} from './cdk.types';

@Injectable()
export class CdkService {
	private readonly logger = new Logger(CdkService.name);

	constructor(
		private configService: ConfigService,
		private credentialService: CredentialService,
	) {}

	public initializeGrpcClient(): grpc.Client {
		const rpc_key = this.configService.get('cashu.rpc_key');
		const rpc_cert = this.configService.get('cashu.rpc_cert');
		const rpc_mtls = this.configService.get('cashu.rpc_mtls');
		const rpc_ca = this.configService.get('cashu.rpc_ca');
		const rpc_host = this.configService.get('cashu.rpc_host');
		const rpc_port = this.configService.get('cashu.rpc_port');
		const rpc_url = `${rpc_host}:${rpc_port}`;

		if (!rpc_host || !rpc_port) {
			this.logger.warn('Missing RPC host or port, connection cannot be established');
			return;
		}

		try {
			const proto_path = path.join(process.cwd(), 'proto/cdk/cdk-mint-rpc.proto');
			const package_definition = protoLoader.loadSync(proto_path, {
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true,
			});
			const mint_proto: any = grpc.loadPackageDefinition(package_definition).cdk_mint_management_v1;
			let credentials: grpc.ChannelCredentials;
			let channel_options: Record<string, any> | undefined = undefined;

			if (rpc_mtls) {
				const key_content = this.credentialService.loadPemOrPath(rpc_key);
				const cert_content = this.credentialService.loadPemOrPath(rpc_cert);
				const ca_content = this.credentialService.loadPemOrPath(rpc_ca);
				credentials = grpc.credentials.createSsl(ca_content, key_content, cert_content);
				if (rpc_host?.includes('host.docker.internal')) {
					channel_options = {
						'grpc.ssl_target_name_override': 'localhost',
						'grpc.default_authority': 'localhost',
					};
				}
				this.logger.log('Mint gRPC client initialized with TLS certificate authentication');
			} else {
				credentials = grpc.credentials.createInsecure();
				this.logger.log('Mint gRPC client initialized with INSECURE connection');
			}

			return new mint_proto.CdkMint(rpc_url, credentials, channel_options);
		} catch (error) {
			this.logger.error(`Failed to initialize gRPC client: ${error.message}`);
		}
	}

	public async getMintBalances(client: CashuMintDatabase, keyset_id?: string): Promise<CashuMintBalance[]> {
		const where_clause = keyset_id ? 'WHERE ka.keyset_id = ?' : '';
		const sql = `
			SELECT
				ka.keyset_id AS keyset,
				ka.total_issued - ka.total_redeemed AS balance,
				k.unit
			FROM keyset_amounts ka
			LEFT JOIN keyset k ON k.id = ka.keyset_id
			${where_clause}
			ORDER BY keyset;
		`;

		const params = keyset_id ? [keyset_id] : [];
		try {
			return queryRows<CashuMintBalance>(client, sql, params);
		} catch (err) {
			throw err;
		}
	}

	public async getMintBalancesIssued(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		const sql = `
			SELECT keyset_id AS keyset, total_issued AS balance
			FROM keyset_amounts
			ORDER BY keyset_id;`;
		try {
			return queryRows<CashuMintBalance>(client, sql);
		} catch (err) {
			throw err;
		}
	}

	public async getMintBalancesRedeemed(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		const sql = `
			SELECT keyset_id AS keyset, total_redeemed AS balance
			FROM keyset_amounts
			ORDER BY keyset_id;`;
		try {
			return queryRows<CashuMintBalance>(client, sql);
		} catch (err) {
			throw err;
		}
	}

	public async getMintKeysets(client: CashuMintDatabase): Promise<CashuMintKeyset[]> {
		const sql = `
            SELECT *, CAST(COALESCE(fee_collected, 0) AS INTEGER) AS fees_paid FROM keyset
            LEFT JOIN keyset_amounts ON keyset_amounts.keyset_id = keyset.id
            WHERE unit != ?;
            `;
		try {
			return queryRows<CashuMintKeyset>(client, sql, ['auth']);
		} catch (err) {
			throw err;
		}
	}

	public async getMintMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<CashuMintMintQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};

		const state_case = `
			CASE
				WHEN amount_paid = 0 AND amount_issued = 0 THEN 'UNPAID'
				WHEN amount_paid > amount_issued THEN 'PAID'
				ELSE 'ISSUED'
			END
		`;

		const issued_time_expr = `
			CASE
				WHEN EXISTS (SELECT 1 FROM mint_quote_issued i WHERE i.quote_id = mint_quote.id)
					THEN (SELECT MIN(timestamp) FROM mint_quote_issued i WHERE i.quote_id = mint_quote.id)
				WHEN amount_paid = 0 AND amount_issued = 0 THEN NULL
				WHEN amount_paid > amount_issued THEN NULL
				ELSE created_time
			END
		`;
		const paid_time_expr = `
			CASE
				WHEN EXISTS (SELECT 1 FROM mint_quote_payments p WHERE p.quote_id = mint_quote.id)
					THEN (SELECT MIN(timestamp) FROM mint_quote_payments p WHERE p.quote_id = mint_quote.id)
				WHEN amount_paid = 0 THEN NULL
				WHEN amount_paid > amount_issued THEN created_time
				WHEN amount_paid = amount_issued THEN created_time
				ELSE NULL
			END
		`;

		const select_statement = `
			SELECT *
			FROM (
				SELECT 
					id, amount, unit, request, request_lookup_id, pubkey, created_time, amount_paid, amount_issued,
					lower(payment_method) AS payment_method,
					${issued_time_expr} AS issued_time,
					${paid_time_expr} AS paid_time,
					${state_case} AS state
				FROM mint_quote
			) mq`;

		const {sql, params} = buildDynamicQuery(MintDatabaseType.sqlite, 'mint_quote', args, field_mappings, select_statement);
		try {
			return queryRows<CashuMintMintQuote>(client, sql, params);
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
		const {sql, params} = buildDynamicQuery(MintDatabaseType.sqlite, 'melt_quote', args, field_mappings);
		try {
			const rows = await queryRows<CashuMintMeltQuote>(client, sql, params);
			return rows.map((row) => {
				const s = extractRequestString(row.request);
				return s ? {...row, request: s} : row;
			});
		} catch (err) {
			throw err;
		}
	}

	public async getMintProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
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
		const {sql, params} = buildDynamicQuery(MintDatabaseType.sqlite, 'proof', args, field_mappings, select_statement, group_by);
		try {
			const rows = await queryRows<CdkMintProof>(client, sql, params);
			const groups = {};
			rows.forEach((row) => {
				const key = `${row.created_time}_${row.unit}_${row.state}`;
				const amounts = Array.isArray(row.amounts) ? row.amounts : JSON.parse(row.amounts);
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
				groups[key].amounts.push(amounts);
			});

			const proof_groups: CashuMintProofGroup[] = Object.values(groups).map((group: any) => ({
				amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
				created_time: group.created_time,
				keyset_ids: group.keysets,
				unit: group.unit,
				state: group.state,
				amounts: group.amounts,
			}));
			return proof_groups;
		} catch (err) {
			throw err;
		}
	}

	public async getMintPromiseGroups(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<CashuMintPromiseGroup[]> {
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

		const {sql, params} = buildDynamicQuery(
			MintDatabaseType.sqlite,
			'blind_signature',
			args,
			field_mappings,
			select_statement,
			group_by,
		);
		try {
			const rows = await queryRows<CdkMintPromise>(client, sql, params);
			const groups = {};
			rows.forEach((row) => {
				const key = `${row.created_time}_${row.unit}`;
				const amounts = Array.isArray(row.amounts) ? row.amounts : JSON.parse(row.amounts);
				if (!groups[key]) {
					groups[key] = {
						created_time: row.created_time,
						unit: row.unit,
						keysets: [],
						amounts: [],
					};
				}
				groups[key].keysets.push(row.keyset_id);
				groups[key].amounts.push(amounts);
			});

			const promise_groups: CashuMintPromiseGroup[] = Object.values(groups).map((group: any) => ({
				amount: group.amounts.flat().reduce((sum, amount) => sum + amount, 0),
				created_time: group.created_time,
				keyset_ids: group.keysets,
				unit: group.unit,
				amounts: group.amounts,
			}));
			return promise_groups;
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

		const state_case = `
			CASE
				WHEN amount_paid = 0 AND amount_issued = 0 THEN 'UNPAID'
				WHEN amount_paid > amount_issued THEN 'PAID'
				ELSE 'ISSUED'
			END
		`;

		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT 
					created_time,
					unit,
					${state_case} AS state
				FROM mint_quote
			) subquery`;

		const {sql, params} = buildCountQuery(MintDatabaseType.sqlite, 'mint_quote', args, field_mappings, select_statement);
		try {
			const row = await queryRow<CashuMintCount>(client, sql, params);
			return row.count;
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
		const {sql, params} = buildCountQuery(MintDatabaseType.sqlite, 'melt_quote', args, field_mappings);
		try {
			const row = await queryRow<CashuMintCount>(client, sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async getMintCountProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<number> {
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
					k.unit,
					p.state
				FROM proof p
				LEFT JOIN keyset k ON k.id = p.keyset_id`;
		const group_by = 'p.created_time, k.unit, p.state';
		const {sql, params} = buildCountQuery(MintDatabaseType.sqlite, 'proof', args, field_mappings, select_statement, group_by);
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
			id_keysets: 'bs.keyset_id',
			date_start: 'bs.created_time',
			date_end: 'bs.created_time',
		};

		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT 
					bs.created_time,
					k.unit
				FROM blind_signature bs
				LEFT JOIN keyset k ON k.id = bs.keyset_id`;
		const group_by = 'bs.created_time, k.unit';
		const {sql, params} = buildCountQuery(MintDatabaseType.sqlite, 'blind_signature', args, field_mappings, select_statement, group_by);
		const final_sql = sql.replace(';', ') subquery;');
		try {
			const row = await queryRow<CashuMintCount>(client, final_sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public getMintKeysetProofCounts(client: CashuMintDatabase, args?: CashuMintKeysetProofsArgs): Promise<CashuMintKeysetProofCount[]> {
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'created_time',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const sql = `SELECT 
			keyset_id AS id,
			COUNT(*) AS count 
			FROM proof
			${where_clause}
			GROUP BY keyset_id;`;
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
			time_column: 'completed_at',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'completed_at',
			group_by: 'unit',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});

		const sql = `
			WITH ops_with_unit AS (
				SELECT
					co.completed_at,
					co.total_issued - co.total_redeemed AS amount,
					COALESCE(bs_k.unit, p_k.unit) AS unit
				FROM completed_operations co
				LEFT JOIN (
					SELECT operation_id, keyset_id FROM blind_signature GROUP BY operation_id
				) bs ON bs.operation_id = co.operation_id
				LEFT JOIN keyset bs_k ON bs_k.id = bs.keyset_id
				LEFT JOIN (
					SELECT operation_id, keyset_id FROM proof GROUP BY operation_id
				) p ON p.operation_id = co.operation_id
				LEFT JOIN keyset p_k ON p_k.id = p.keyset_id
			)
			SELECT
				${time_group_sql} AS time_group,
				unit,
				SUM(amount) AS amount,
				COUNT(*) AS operation_count,
				MIN(completed_at) as min_created_time
			FROM
				ops_with_unit
				${where_clause}
			GROUP BY
				time_group, unit
			ORDER BY
				min_created_time;`;

		try {
			const rows = await queryRows<CdkMintAnalytics>(client, sql, params);
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
			time_is_epoch_seconds: true,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});
		const sql = `
			SELECT 
				${time_group_sql} AS time_group,
				unit,
				SUM(amount_issued) AS amount,
				COUNT(DISTINCT CASE WHEN amount_issued > 0 THEN id ELSE NULL END) AS operation_count,
				MIN(created_time) as min_created_time
			FROM 
				mint_quote
				${where_clause}
			GROUP BY 
				time_group, unit
			ORDER BY 
				min_created_time;`;

		try {
			const rows = await queryRows<CdkMintAnalytics>(client, sql, params);
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
			time_is_epoch_seconds: true,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
			db_type: client.type,
			time_is_epoch_seconds: true,
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

		try {
			const rows = await queryRows<CdkMintAnalytics>(client, sql, params);
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
			time_column: 'created_time',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});
		where_conditions.push('quote_id IS NULL');
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'unit',
			db_type: client.type,
			time_is_epoch_seconds: true,
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

		try {
			const rows = await queryRows<CdkMintAnalytics>(client, sql, params);
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

	/** Retrieves fee analytics from completed_operations, grouped by time interval and unit. */
	public async getMintAnalyticsFees(client: CashuMintDatabase, args?: CashuMintAnalyticsArgs): Promise<CashuMintAnalytics[]> {
		const interval = args?.interval || MintAnalyticsInterval.day;
		const timezone = args?.timezone || 'UTC';
		const {where_conditions, params} = getAnalyticsConditions({
			args: args,
			time_column: 'completed_at',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'completed_at',
			group_by: 'unit',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});

		const sql = `
			WITH ops_with_unit AS (
				SELECT
					co.completed_at,
					co.fee_collected,
					COALESCE(bs_k.unit, p_k.unit) AS unit
				FROM completed_operations co
				LEFT JOIN (
					SELECT operation_id, keyset_id FROM blind_signature GROUP BY operation_id
				) bs ON bs.operation_id = co.operation_id
				LEFT JOIN keyset bs_k ON bs_k.id = bs.keyset_id
				LEFT JOIN (
					SELECT operation_id, keyset_id FROM proof GROUP BY operation_id
				) p ON p.operation_id = co.operation_id
				LEFT JOIN keyset p_k ON p_k.id = p.keyset_id
			)
			SELECT
				${time_group_sql} AS time_group,
				unit,
				SUM(fee_collected) AS amount,
				COUNT(*) AS operation_count,
				MIN(completed_at) as min_created_time
			FROM
				ops_with_unit
				${where_clause}
			GROUP BY
				time_group, unit
			ORDER BY
				min_created_time;`;

		try {
			const rows = await queryRows<CdkMintAnalytics>(client, sql, params);
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
			time_column: 'created_time',
			db_type: client.type,
			time_is_epoch_seconds: true,
		});
		const where_clause = where_conditions.length > 0 ? `WHERE ${where_conditions.join(' AND ')}` : '';
		const time_group_sql = getAnalyticsTimeGroupSql({
			interval: interval,
			timezone: timezone,
			time_column: 'created_time',
			group_by: 'keyset_id',
			db_type: client.type,
			time_is_epoch_seconds: true,
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

		try {
			const rows = await queryRows<CdkMintKeysetsAnalytics>(client, sql, [...params, ...params]);
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
