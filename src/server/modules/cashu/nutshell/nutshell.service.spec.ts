/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
import {Logger} from '@nestjs/common';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {NutshellService} from './nutshell.service';
import * as grpc from '@grpc/grpc-js';

jest.mock('@server/modules/cashu/mintdb/cashumintdb.helpers', () => ({
	__esModule: true,
	buildDynamicQuery: jest.fn().mockReturnValue({sql: 'SQL', params: []}),
	buildCountQuery: jest.fn().mockReturnValue({sql: 'COUNTSQL', params: []}),
	getAnalyticsTimeGroupStamp: jest.fn().mockReturnValue(1234567890),
	getAnalyticsConditions: jest.fn().mockReturnValue({where_conditions: [], params: []}),
	getAnalyticsTimeGroupSql: jest.fn().mockReturnValue('TIME_GROUP'),
	convertDateToUnixTimestamp: jest.fn().mockImplementation((d: any) => (typeof d === 'number' ? d : 1)),
	queryRows: jest.fn(),
	queryRow: jest.fn().mockResolvedValue({count: 1}),
}));
import * as helpers from '@server/modules/cashu/mintdb/cashumintdb.helpers';

describe('NutshellService', () => {
	let nutshell_service: NutshellService;
	let config_service: jest.Mocked<ConfigService>;
	let credential_service: jest.Mocked<CredentialService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NutshellService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
			],
		}).compile();

		nutshell_service = module.get<NutshellService>(NutshellService);
		config_service = module.get(ConfigService) as any;
		credential_service = module.get(CredentialService) as any;
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(nutshell_service).toBeDefined();
	});

	it('returns undefined client when credentials missing', () => {
		const client = nutshell_service.initializeGrpcClient();
		expect(client).toBeUndefined();
	});

	it('initializes client when credentials present', () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_key':
					return 'KEY';
				case 'cashu.rpc_cert':
					return 'CERT';
				case 'cashu.rpc_ca':
					return 'CA';
				case 'cashu.rpc_host':
					return 'localhost';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		credential_service.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		const loadPackageDefinition = jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cashu: {Mint: jest.fn()}} as any);
		nutshell_service.initializeGrpcClient();
		expect(createSsl).toHaveBeenCalled();
		expect(loadSync).toHaveBeenCalled();
		expect(loadPackageDefinition).toHaveBeenCalled();
	});

	it('initializes client with docker host channel options', () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_key':
					return 'KEY';
				case 'cashu.rpc_cert':
					return 'CERT';
				case 'cashu.rpc_ca':
					return 'CA';
				case 'cashu.rpc_host':
					return 'host.docker.internal';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		credential_service.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue('DEF' as any);
		const mint_ctor = jest.fn();
		jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cashu: {Mint: mint_ctor}} as any);
		nutshell_service.initializeGrpcClient();
		const args = mint_ctor.mock.calls[0];
		expect(args[2]).toMatchObject({
			'grpc.ssl_target_name_override': 'localhost',
			'grpc.default_authority': 'localhost',
		});
	});

	it('initializeGrpcClient logs error and returns undefined when loader throws', () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_key':
					return 'KEY';
				case 'cashu.rpc_cert':
					return 'CERT';
				case 'cashu.rpc_ca':
					return 'CA';
				case 'cashu.rpc_host':
					return 'localhost';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		credential_service.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync');
		loadSync.mockImplementation(() => {
			throw new Error('boom');
		});
		const logger_error = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined as any);
		const out = nutshell_service.initializeGrpcClient();
		expect(out).toBeUndefined();
		expect(logger_error).toHaveBeenCalled();
	});

	it('initializeGrpcClient uses correct proto path and buffers', () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_key':
					return 'KEY';
				case 'cashu.rpc_cert':
					return 'CERT';
				case 'cashu.rpc_ca':
					return 'CA';
				case 'cashu.rpc_host':
					return 'localhost';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		const key_buf = Buffer.from('k');
		const cert_buf = Buffer.from('c');
		const ca_buf = Buffer.from('a');
		credential_service.loadPemOrPath.mockReturnValueOnce(key_buf).mockReturnValueOnce(cert_buf).mockReturnValueOnce(ca_buf);
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cashu: {Mint: jest.fn()}} as any);
		nutshell_service.initializeGrpcClient();
		const load_arg = loadSync.mock.calls[0][0];
		expect(String(load_arg)).toContain('proto/nutshell/management.proto');
		expect(createSsl).toHaveBeenCalledWith(ca_buf, key_buf, cert_buf);
		const logger_log = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined as any);
		logger_log.mockClear();
		nutshell_service.initializeGrpcClient();
		// ensure success path log is called
		expect(logger_log).toHaveBeenCalledTimes(1);
	});

	it('getMintKeysets converts dates and derives path index', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{valid_from: '2024-01-01', valid_to: '2024-01-02', derivation_path: "m/86'/0'/0'"},
		]);
		const out = await nutshell_service.getMintKeysets({} as any);
		expect(out[0].valid_from).toBe(1);
		expect(out[0].valid_to).toBe(1);
		expect(out[0].derivation_path_index).toBe(0);
	});

	it('getMintKeysets handles null path index and prime suffix; passes auth filter and logs on error', async () => {
		(helpers.queryRows as jest.Mock)
			.mockResolvedValueOnce([
				{valid_from: 'x', valid_to: 'y', derivation_path: undefined},
				{valid_from: 'x', valid_to: 'y', derivation_path: "m/86'/0'/1'"},
			])
			.mockRejectedValueOnce(new Error('fail'));
		let out = await nutshell_service.getMintKeysets({} as any);
		expect(out[0].derivation_path_index).toBeNull();
		expect(out[1].derivation_path_index).toBe(1);
		// verify auth param applied
		const call = (helpers.queryRows as jest.Mock).mock.calls[0];
		expect(call[2]).toEqual(['auth']);
		// error path
		const logger_error = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined as any);
		await expect(nutshell_service.getMintKeysets({} as any)).rejects.toThrow('fail');
		expect(logger_error).toHaveBeenCalled();
	});

	it('getMintBalances builds SQL with and without keyset_id and propagates errors', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintBalances({} as any);
		let call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain('SELECT * FROM balance');
		expect(call[2]).toEqual([]);
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintBalances({} as any, 'K1');
		call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain('WHERE keyset = ?');
		expect(call[2]).toEqual(['K1']);
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('badsql');
		});
		await expect(nutshell_service.getMintBalances({} as any)).rejects.toThrow('badsql');
	});

	it('getMintBalancesIssued and Redeemed query correct tables and propagate errors', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintBalancesIssued({} as any);
		let call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toBe('SELECT * FROM balance_issued;');
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintBalancesRedeemed({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toBe('SELECT * FROM balance_redeemed;');
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('oops');
		});
		await expect(nutshell_service.getMintBalancesIssued({} as any)).rejects.toThrow('oops');
	});

	it('getMintMintQuotes maps fields and uses buildDynamicQuery', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValueOnce({sql: 'S', params: ['P']});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{quote: 'q1', checking_id: 'c1', state: 'ISSUED', paid_time: 'pt', created_time: 'ct', amount: 5},
			{quote: 'q2', checking_id: 'c2', state: 'PENDING', paid_time: 'pt', created_time: 'ct', amount: 7},
		]);
		const out = await nutshell_service.getMintMintQuotes({type: 'sqlite'} as any, {states: ['ISSUED']} as any);
		expect(helpers.buildDynamicQuery).toHaveBeenCalledWith('sqlite', 'mint_quotes', {states: ['ISSUED']}, expect.any(Object));
		expect(out[0]).toMatchObject({id: 'q1', request_lookup_id: 'c1', amount_paid: 5, amount_issued: 5});
		expect(out[0].issued_time).toBe(1);
		expect(out[1].issued_time).toBeNull();
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('err');
		});
		await expect(nutshell_service.getMintMintQuotes({type: 'sqlite'} as any)).rejects.toThrow('err');
	});

	it('getMintMeltQuotes maps fields and uses buildDynamicQuery', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValueOnce({sql: 'S2', params: ['P2']});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([{quote: 'q1', checking_id: 'c1', paid_time: 'pt', created_time: 'ct'}]);
		const out = await nutshell_service.getMintMeltQuotes({type: 'postgres'} as any, {states: ['PAID']} as any);
		expect(helpers.buildDynamicQuery).toHaveBeenCalledWith('postgres', 'melt_quotes', {states: ['PAID']}, expect.any(Object));
		expect(out[0]).toMatchObject({id: 'q1', request_lookup_id: 'c1', payment_preimage: null, msat_to_pay: null});
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('err2');
		});
		await expect(nutshell_service.getMintMeltQuotes({type: 'sqlite'} as any)).rejects.toThrow('err2');
	});

	it('getMintProofGroups groups by created and unit, aggregates amounts, handles array/string', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created: 't', id: 'k1', unit: 'sat', amounts: '[1,2]'},
			{created: 't', id: 'k2', unit: 'sat', amounts: [3]},
		]);
		const out = await nutshell_service.getMintProofGroups({type: 'sqlite'} as any, {} as any);
		expect(out).toHaveLength(1);
		expect(out[0].amount).toBe(6);
		expect(out[0].state).toBe('SPENT');
		expect(out[0].keyset_ids).toEqual(['k1', 'k2']);
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('pg');
		});
		await expect(nutshell_service.getMintProofGroups({type: 'sqlite'} as any)).rejects.toThrow('pg');
	});

	it('getMintPromiseGroups groups and aggregates amounts', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created: 't', id: 'k1', unit: 'sat', amounts: '[1,2]'},
			{created: 't', id: 'k2', unit: 'sat', amounts: [3]},
		]);
		const out = await nutshell_service.getMintPromiseGroups({type: 'sqlite'} as any, {} as any);
		expect(out).toHaveLength(1);
		expect(out[0].amount).toBe(6);
		expect(out[0].keyset_ids).toEqual(['k1', 'k2']);
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('prom');
		});
		await expect(nutshell_service.getMintPromiseGroups({type: 'sqlite'} as any)).rejects.toThrow('prom');
	});

	it('count methods return row.count and proof/promise group wrap subquery', async () => {
		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT x FROM melt_quotes;', params: ['a']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 3});
		await expect(nutshell_service.getMintCountMeltQuotes({type: 'sqlite'} as any, {} as any)).resolves.toBe(3);

		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT x FROM mint_quotes;', params: ['b']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 4});
		await expect(nutshell_service.getMintCountMintQuotes({type: 'sqlite'} as any, {} as any)).resolves.toBe(4);

		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT ... FROM proofs_used;', params: ['c']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 5});
		await nutshell_service.getMintCountProofGroups({type: 'sqlite'} as any, {} as any);
		let call = (helpers.queryRow as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain(') subquery;');

		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT ... FROM promises;', params: ['d']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 6});
		await nutshell_service.getMintCountPromiseGroups({type: 'sqlite'} as any, {} as any);
		call = (helpers.queryRow as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain(') subquery;');
	});

	it('getMintFees uses default/custom limit and propagates errors', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintFees({} as any);
		let call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[2]).toEqual([1]);
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintFees({} as any, 10);
		call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[2]).toEqual([10]);
		(helpers.queryRows as jest.Mock).mockImplementationOnce(() => {
			throw new Error('fee');
		});
		await expect(nutshell_service.getMintFees({} as any)).rejects.toThrow('fee');
	});

	it('getMintKeysetProofCounts builds WHERE when conditions exist and passes params', async () => {
		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValueOnce({where_conditions: ['unit = ?'], params: ['sat']});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await nutshell_service.getMintKeysetProofCounts({type: 'sqlite'} as any, {units: ['sat']} as any);
		const call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain('WHERE unit = ?');
		expect(call[2]).toEqual(['sat']);
	});

	it('getMintAnalyticsBalances applies defaults and override to stamp, calls helpers', async () => {
		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValue({where_conditions: [], params: []});
		(helpers.getAnalyticsTimeGroupSql as jest.Mock).mockReturnValue('TG');
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{unit: 'sat', amount: 2, operation_count: 3, time_group: '2024-01-01', min_created_time: 100},
		]);
		const out_default = await nutshell_service.getMintAnalyticsBalances({type: 'sqlite'} as any, undefined as any);
		expect(out_default[0]).toMatchObject({unit: 'sat', amount: 2, operation_count: 3, created_time: 1234567890});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{unit: 'sat', amount: 5, operation_count: 7, time_group: '2024-02-01', min_created_time: 200},
		]);
		await nutshell_service.getMintAnalyticsBalances({type: 'sqlite'} as any, {interval: 'month', timezone: 'America/New_York'} as any);
		expect(helpers.getAnalyticsTimeGroupSql).toHaveBeenLastCalledWith({
			interval: 'month',
			timezone: 'America/New_York',
			time_column: 'created',
			group_by: 'unit',
			db_type: 'sqlite',
		});
	});

	it('getMintAnalyticsSwaps injects melt_quote IS NULL and stamps output', async () => {
		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValue({where_conditions: [], params: []});
		(helpers.getAnalyticsTimeGroupSql as jest.Mock).mockReturnValue('TG');
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{unit: 'sat', amount: 10, operation_count: 1, time_group: '2024-01', min_created_time: 100},
		]);
		await nutshell_service.getMintAnalyticsSwaps({type: 'sqlite'} as any, {} as any);
		const call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain('melt_quote IS NULL');
	});

	it('getMintAnalyticsFees uses custom interval fee calculation and stamps output', async () => {
		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValue({where_conditions: [], params: []});
		(helpers.getAnalyticsTimeGroupSql as jest.Mock).mockReturnValue('TG');
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{unit: 'sat', amount: 1, operation_count: 1, time_group: '2024-01', min_created_time: 100},
		]);
		await nutshell_service.getMintAnalyticsFees({type: 'sqlite'} as any, {interval: 'custom'} as any);
		const call = (helpers.queryRows as jest.Mock).mock.calls.pop();
		expect(call[1]).toContain('MAX(keyset_fees_paid) AS amount');
	});
});
