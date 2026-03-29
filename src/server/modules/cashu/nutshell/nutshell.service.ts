/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as path from 'path';
/* Vendor Dependencies */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
import {MintUnit, MintProofState} from '@server/modules/cashu/cashu.enums';
/* Native Dependencies */
import {
	CashuMintDatabase,
	CashuMintBalance,
	CashuMintKeyset,
	CashuMintMeltQuote,
	CashuMintMintQuote,
	CashuMintProofGroup,
	CashuMintProof,
	CashuMintPromise,
	CashuMintSwap,
	CashuMintCount,
	CashuMintFee,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {
	CashuMintMintQuotesArgs,
	CashuMintMeltQuotesArgs,
	CashuMintProofsArgs,
	CashuMintPromiseArgs,
	CashuMintSwapsArgs,
} from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import {
	buildDynamicQuery,
	buildCountQuery,
	convertDateToUnixTimestamp,
	queryRows,
	queryRow,
} from '@server/modules/cashu/mintdb/cashumintdb.helpers';
import {MintDatabaseType} from '@server/modules/cashu/mintdb/cashumintdb.enums';
/* Local Dependencies */
import {NutshellMintMintQuote, NutshellMintMeltQuote, NutshellMintEcash} from './nutshell.types';

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
			const proto_path = path.join(process.cwd(), 'proto/nutshell/management.proto');
			const package_definition = protoLoader.loadSync(proto_path, {
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true,
			});
			const mint_proto: any = grpc.loadPackageDefinition(package_definition).cashu;

			let credentials: grpc.ChannelCredentials;
			let channel_options: Record<string, any> | undefined = undefined;

			if (rpc_mtls) {
				const key_content = this.credentialService.loadPemOrPath(rpc_key);
				const cert_content = this.credentialService.loadPemOrPath(rpc_cert);
				const ca_content = this.credentialService.loadPemOrPath(rpc_ca);

				if (!key_content || !cert_content || !ca_content) {
					const missing = [!ca_content && 'CA certificate', !cert_content && 'client certificate', !key_content && 'client key']
						.filter(Boolean)
						.join(', ');
					this.logger.error(
						`Failed to load Nutshell mTLS credential(s): ${missing} — check that the file paths exist and are readable`,
					);
					return undefined;
				}

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

			return new mint_proto.Mint(rpc_url, credentials, channel_options);
		} catch (error) {
			this.logger.error(`Failed to initialize gRPC client: ${error.message}`);
		}
	}

	public async getBalances(client: CashuMintDatabase, keyset_id?: string): Promise<CashuMintBalance[]> {
		const where_clause = keyset_id ? `WHERE b.keyset = ?` : '';
		const sql = `SELECT b.keyset, b.balance, k.unit FROM balance b LEFT JOIN keysets k ON k.id = b.keyset ${where_clause};`;
		const params = keyset_id ? [keyset_id] : [];
		try {
			return queryRows<CashuMintBalance>(client, sql, params);
		} catch (err) {
			throw err;
		}
	}

	public async getBalancesIssued(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_issued;';
		try {
			return queryRows<CashuMintBalance>(client, sql);
		} catch (err) {
			throw err;
		}
	}

	public async getBalancesRedeemed(client: CashuMintDatabase): Promise<CashuMintBalance[]> {
		const sql = 'SELECT * FROM balance_redeemed;';
		try {
			return queryRows<CashuMintBalance>(client, sql);
		} catch (err) {
			throw err;
		}
	}

	public async getKeysets(client: CashuMintDatabase): Promise<CashuMintKeyset[]> {
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

	public async listMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<CashuMintMintQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildDynamicQuery({
			db_type: client.type,
			table_name: 'mint_quotes',
			args,
			field_mappings,
		});
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
				payment_method: 'bolt11',
			}));
		} catch (err) {
			throw err;
		}
	}

	public async lookupMintQuote(client: CashuMintDatabase, quote_id: string): Promise<CashuMintMintQuote | null> {
		const sql = `SELECT * FROM mint_quotes WHERE quote = ?`;
		try {
			const row = await queryRow<NutshellMintMintQuote | undefined>(client, sql, [quote_id]);
			if (!row) return null;
			return {
				...row,
				id: row.quote,
				request_lookup_id: row.checking_id,
				issued_time: row.state === 'ISSUED' ? convertDateToUnixTimestamp(row.paid_time) : null,
				created_time: convertDateToUnixTimestamp(row.created_time),
				paid_time: convertDateToUnixTimestamp(row.paid_time),
				amount_paid: row.amount,
				amount_issued: row.amount,
				payment_method: 'bolt11',
			};
		} catch (err) {
			throw err;
		}
	}

	public async lookupMeltQuote(client: CashuMintDatabase, quote_id: string): Promise<CashuMintMeltQuote | null> {
		const sql = `SELECT * FROM melt_quotes WHERE quote = ?`;
		try {
			const row = await queryRow<NutshellMintMeltQuote | undefined>(client, sql, [quote_id]);
			if (!row) return null;
			return {
				...row,
				id: row.quote,
				request_lookup_id: row.checking_id,
				paid_time: convertDateToUnixTimestamp(row.paid_time),
				created_time: convertDateToUnixTimestamp(row.created_time),
				payment_preimage: row.proof,
				msat_to_pay: null,
				payment_method: 'bolt11',
			};
		} catch (err) {
			throw err;
		}
	}

	public async listMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<CashuMintMeltQuote[]> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildDynamicQuery({
			db_type: client.type,
			table_name: 'melt_quotes',
			args,
			field_mappings,
		});
		try {
			const rows = await queryRows<NutshellMintMeltQuote>(client, sql, params);
			return rows.map((row) => ({
				...row,
				id: row.quote,
				request_lookup_id: row.checking_id,
				paid_time: convertDateToUnixTimestamp(row.paid_time),
				created_time: convertDateToUnixTimestamp(row.created_time),
				payment_preimage: row.proof,
				msat_to_pay: null,
				payment_method: 'bolt11',
			}));
		} catch (err) {
			throw err;
		}
	}

	public async listProofGroups(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<CashuMintProofGroup[]> {
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
		const {sql, params} = buildDynamicQuery({
			db_type: client.type,
			table_name: 'proofs_used',
			args,
			field_mappings,
			select_statement,
			group_by,
		});
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

	public async listProofs(client: CashuMintDatabase, args?: CashuMintProofsArgs): Promise<CashuMintProof[]> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'p.id',
			date_start: 'p.created',
			date_end: 'p.created',
		};

		const select_statement = `
			SELECT
				p.amount,
				p.id AS keyset_id,
				k.unit,
				p.created AS created_time
			FROM proofs_used p
			LEFT JOIN keysets k ON k.id = p.id`;

		const {sql, params} = buildDynamicQuery({
			db_type: client.type,
			table_name: 'proofs_used',
			args,
			field_mappings,
			select_statement,
		});
		const rows = await queryRows<{amount: number; keyset_id: string; unit: MintUnit; created_time: number | string}>(
			client,
			sql,
			params,
		);
		return rows.map((row) => ({
			...row,
			created_time: convertDateToUnixTimestamp(row.created_time),
			state: MintProofState.SPENT,
		}));
	}

	public async listPromises(client: CashuMintDatabase, args?: CashuMintPromiseArgs): Promise<CashuMintPromise[]> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'p.id',
			date_start: 'p.created',
			date_end: 'p.created',
		};

		const select_statement = `
			SELECT
				p.amount,
				p.id AS keyset_id,
				k.unit,
				p.created AS created_time
			FROM promises p
			LEFT JOIN keysets k ON k.id = p.id`;

		const {sql, params} = buildDynamicQuery({
			db_type: client.type,
			table_name: 'promises',
			args,
			field_mappings,
			select_statement,
		});
		const rows = await queryRows<{amount: number; keyset_id: string; unit: MintUnit; created_time: number | string}>(
			client,
			sql,
			params,
		);
		return rows.map((row) => ({
			...row,
			created_time: convertDateToUnixTimestamp(row.created_time),
		}));
	}

	public async countMeltQuotes(client: CashuMintDatabase, args?: CashuMintMeltQuotesArgs): Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildCountQuery({
			db_type: client.type,
			table_name: 'melt_quotes',
			args,
			field_mappings,
		});
		try {
			const row = await queryRow<CashuMintCount>(client, sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async countMintQuotes(client: CashuMintDatabase, args?: CashuMintMintQuotesArgs): Promise<number> {
		const field_mappings = {
			units: 'unit',
			date_start: 'created_time',
			date_end: 'created_time',
			states: 'state',
		};
		const {sql, params} = buildCountQuery({
			db_type: client.type,
			table_name: 'mint_quotes',
			args,
			field_mappings,
		});
		try {
			const row = await queryRow<CashuMintCount>(client, sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async listSwaps(client: CashuMintDatabase, args?: CashuMintSwapsArgs): Promise<CashuMintSwap[]> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'pu.id',
			date_start: 'pu.created',
			date_end: 'pu.created',
		};

		const concat_keyset_ids =
			client.type === MintDatabaseType.postgres ? `STRING_AGG(DISTINCT pu.id, ',')` : `GROUP_CONCAT(DISTINCT pu.id)`;

		const select_statement = `
			SELECT
				NULL AS operation_id,
				${concat_keyset_ids} AS keyset_ids,
				k.unit,
				SUM(pu.amount) AS amount,
				pu.created AS created_time,
				NULL AS fee
			FROM (SELECT * FROM proofs_used WHERE melt_quote IS NULL) pu
			LEFT JOIN keysets k ON k.id = pu.id`;

		const group_by = 'pu.created, k.unit';
		const {sql, params} = buildDynamicQuery({
			db_type: client.type,
			table_name: 'proofs_used',
			args,
			field_mappings,
			select_statement,
			group_by,
		});
		try {
			const rows = await queryRows<CashuMintSwap & {keyset_ids: string}>(client, sql, params);
			return rows.map((row) => ({
				...row,
				keyset_ids: row.keyset_ids ? row.keyset_ids.split(',') : [],
				created_time: convertDateToUnixTimestamp(row.created_time),
			}));
		} catch (err) {
			throw err;
		}
	}

	public async countSwaps(client: CashuMintDatabase, args?: CashuMintSwapsArgs): Promise<number> {
		const field_mappings = {
			units: 'k.unit',
			id_keysets: 'pu.id',
			date_start: 'pu.created',
			date_end: 'pu.created',
		};

		const select_statement = `
			SELECT COUNT(*) AS count FROM (
				SELECT pu.created
				FROM (SELECT * FROM proofs_used WHERE melt_quote IS NULL) pu
				LEFT JOIN keysets k ON k.id = pu.id`;

		const group_by = 'pu.created';
		const {sql, params} = buildCountQuery({
			db_type: client.type,
			table_name: 'proofs_used',
			args,
			field_mappings,
			select_statement,
			group_by,
		});
		const final_sql = sql.replace(';', ') subquery;');
		try {
			const row = await queryRow<CashuMintCount>(client, final_sql, params);
			return row.count;
		} catch (err) {
			throw err;
		}
	}

	public async getFees(client: CashuMintDatabase, limit: number = 1): Promise<CashuMintFee[]> {
		const sql = `SELECT * FROM balance_log ORDER BY time ASC LIMIT ?;`;
		try {
			return queryRows<CashuMintFee>(client, sql, [limit]);
		} catch (err) {
			throw err;
		}
	}
}
