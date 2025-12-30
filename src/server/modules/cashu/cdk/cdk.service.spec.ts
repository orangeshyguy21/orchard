/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
import {Logger} from '@nestjs/common';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {CdkService} from './cdk.service';
import * as grpc from '@grpc/grpc-js';

jest.mock('@server/modules/cashu/mintdb/cashumintdb.helpers', () => ({
	__esModule: true,
	buildDynamicQuery: jest.fn().mockReturnValue({sql: 'SQL', params: []}),
	buildCountQuery: jest.fn().mockReturnValue({sql: 'COUNTSQL', params: []}),
	getAnalyticsTimeGroupStamp: jest.fn().mockReturnValue(1234567890),
	getAnalyticsConditions: jest.fn().mockReturnValue({where_conditions: [], params: []}),
	getAnalyticsTimeGroupSql: jest.fn().mockReturnValue('TIME_GROUP'),
	queryRows: jest.fn(),
	queryRow: jest.fn().mockResolvedValue({count: 1}),
	extractRequestString: jest.fn().mockImplementation((s: string) => s?.replace(/^.*:/, '')),
}));
import * as helpers from '@server/modules/cashu/mintdb/cashumintdb.helpers';

describe('CdkService', () => {
	let cdkService: CdkService;
	let configService: jest.Mocked<ConfigService>;
	let credentialService: jest.Mocked<CredentialService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CdkService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
			],
		}).compile();

		jest.clearAllMocks();

		cdkService = module.get<CdkService>(CdkService);
		configService = module.get(ConfigService);
		credentialService = module.get(CredentialService);
	});

	it('should be defined', () => {
		expect(cdkService).toBeDefined();
	});

	it('returns undefined client when credentials missing', () => {
		const warn_spy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined as any);
		const client = cdkService.initializeGrpcClient();
		expect(client).toBeUndefined();
		expect(warn_spy).toHaveBeenCalled();
	});

	it('initializes client when credentials present', () => {
		configService.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_key':
					return 'KEY';
				case 'cashu.rpc_cert':
					return 'CERT';
				case 'cashu.rpc_ca':
					return 'CA';
				case 'cashu.rpc_mtls':
					return true;
				case 'cashu.rpc_host':
					return 'localhost';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		credentialService.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		const loadPackageDefinition = jest
			.spyOn(grpc, 'loadPackageDefinition')
			.mockReturnValue({cdk_mint_rpc: {CdkMint: jest.fn()}} as any);
		cdkService.initializeGrpcClient();
		expect(createSsl).toHaveBeenCalled();
		expect(loadSync).toHaveBeenCalled();
		expect(loadPackageDefinition).toHaveBeenCalled();
	});

	it('initializes client with docker channel options when host.docker.internal', () => {
		const CdkMintMock = jest.fn();
		configService.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_key':
					return 'KEY';
				case 'cashu.rpc_cert':
					return 'CERT';
				case 'cashu.rpc_ca':
					return 'CA';
				case 'cashu.rpc_mtls':
					return true;
				case 'cashu.rpc_host':
					return 'host.docker.internal';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		credentialService.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cdk_mint_rpc: {CdkMint: CdkMintMock}} as any);
		cdkService.initializeGrpcClient();
		expect(CdkMintMock).toHaveBeenCalled();
		const args = CdkMintMock.mock.calls[0];
		expect(args[2]).toMatchObject({
			'grpc.ssl_target_name_override': 'localhost',
			'grpc.default_authority': 'localhost',
		});
	});

	it('initializes client with insecure credentials when rpc_mtls is false', () => {
		const CdkMintMock = jest.fn();
		configService.get.mockImplementation((key: string) => {
			switch (key) {
				case 'cashu.rpc_mtls':
					return false;
				case 'cashu.rpc_host':
					return 'localhost';
				case 'cashu.rpc_port':
					return 3333;
				default:
					return undefined as any;
			}
		});
		const log_spy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined as any);
		const createInsecure = jest.spyOn(grpc.credentials, 'createInsecure').mockReturnValue({} as any);
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cdk_mint_rpc: {CdkMint: CdkMintMock}} as any);
		const client = cdkService.initializeGrpcClient();
		expect(client).toBeDefined();
		expect(createInsecure).toHaveBeenCalled();
		expect(createSsl).not.toHaveBeenCalled();
		expect(credentialService.loadPemOrPath).not.toHaveBeenCalled();
		expect(log_spy).toHaveBeenCalledWith('Mint gRPC client initialized with INSECURE connection');
	});

	it('logs error and returns undefined if proto load fails', () => {
		const error_spy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined as any);
		configService.get.mockImplementation((key: string) => {
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
		credentialService.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockImplementation(() => {
			throw new Error('boom');
		});
		const client = cdkService.initializeGrpcClient();
		expect(client).toBeUndefined();
		expect(error_spy).toHaveBeenCalled();
	});

	it('getMintMeltQuotes maps request using extractRequestString', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{id: 'q1', request: 'bolt11:lnbc123', unit: 'sat', state: 'PAID', created_time: 1},
		]);
		const out = await cdkService.getMintMeltQuotes({} as any);
		expect(out[0].request).toBe('lnbc123');
	});

	it('getMintMeltQuotes leaves request unchanged when extractRequestString falsy', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{id: 'q1', request: 'nostr:xyz', unit: 'sat', state: 'PAID', created_time: 1},
		]);
		(helpers.extractRequestString as jest.Mock).mockReturnValueOnce('');
		const out = await cdkService.getMintMeltQuotes({} as any);
		expect(out[0].request).toBe('nostr:xyz');
	});

	it('getMintMeltQuotes propagates query error', async () => {
		(helpers.queryRows as jest.Mock).mockRejectedValueOnce(new Error('fail'));
		await expect(cdkService.getMintMeltQuotes({} as any)).rejects.toThrow('fail');
	});

	it('getMintProofGroups groups amounts and sums', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: '[1,2]'},
			{created_time: 10, keyset_id: 'k2', unit: 'sat', state: 'SPENT', amounts: '[3]'},
		]);
		const out = await cdkService.getMintProofGroups({} as any);
		expect(out).toHaveLength(1);
		expect(out[0].amount).toBe(6);
		expect(out[0].keyset_ids).toEqual(['k1', 'k2']);
	});

	it('getMintProofGroups supports array amounts, multiple groups and empty input', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: [1]},
			{created_time: 10, keyset_id: 'k2', unit: 'sat', state: 'SPENT', amounts: '[2]'},
			{created_time: 11, keyset_id: 'k9', unit: 'sat', state: 'SPENT', amounts: '[3]'},
		]);
		const out = await cdkService.getMintProofGroups({} as any);
		expect(out).toHaveLength(2);
		const g1 = out.find((g) => g.created_time === 10);
		expect(g1.amount).toBe(3);
		const g2 = out.find((g) => g.created_time === 11);
		expect(g2.amount).toBe(3);

		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		const empty = await cdkService.getMintProofGroups({} as any);
		expect(empty).toEqual([]);
	});

	it('getMintProofGroups rejects on invalid JSON amounts', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: 'not-json'},
		]);
		await expect(cdkService.getMintProofGroups({} as any)).rejects.toThrow();
	});

	it('getMintPromiseGroups groups by created_time and sums', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', amounts: '[1,2]'},
			{created_time: 10, keyset_id: 'k2', unit: 'sat', amounts: [3]},
		]);
		const out = await cdkService.getMintPromiseGroups({} as any);
		expect(out).toHaveLength(1);
		expect(out[0].amount).toBe(6);
		expect(out[0].keyset_ids).toEqual(['k1', 'k2']);
	});

	it('getMintPromiseGroups handles empty and invalid JSON cases', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		const empty = await cdkService.getMintPromiseGroups({} as any);
		expect(empty).toEqual([]);

		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([{created_time: 10, keyset_id: 'k1', unit: 'sat', amounts: 'bad-json'}]);
		await expect(cdkService.getMintPromiseGroups({} as any)).rejects.toThrow();
	});

	it('getMintCountMintQuotes and getMintCountMeltQuotes return row.count', async () => {
		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT 1;', params: ['a']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 7});
		await expect(cdkService.getMintCountMintQuotes({} as any)).resolves.toBe(7);

		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT 2;', params: ['b']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 5});
		await expect(cdkService.getMintCountMeltQuotes({} as any)).resolves.toBe(5);
	});

	it('getMintCountProofGroups and getMintCountPromiseGroups wrap SQL into subquery', async () => {
		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT 1;', params: []});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 3});
		await cdkService.getMintCountProofGroups({} as any);
		const proof_call = (helpers.queryRow as jest.Mock).mock.calls[(helpers.queryRow as jest.Mock).mock.calls.length - 1];
		expect(proof_call[1]).toBe('SELECT 1) subquery;');

		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT 9;', params: []});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 9});
		await cdkService.getMintCountPromiseGroups({} as any);
		const promise_call = (helpers.queryRow as jest.Mock).mock.calls[(helpers.queryRow as jest.Mock).mock.calls.length - 1];
		expect(promise_call[1]).toBe('SELECT 9) subquery;');
	});

	it('getMintKeysetProofCounts builds optional WHERE clause', async () => {
		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValueOnce({where_conditions: [], params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await cdkService.getMintKeysetProofCounts({} as any);
		const first_sql = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1][1];
		expect(first_sql).not.toContain('WHERE ');

		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValueOnce({where_conditions: ['created_time > ?'], params: [1]});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		await cdkService.getMintKeysetProofCounts({} as any, {date_start: 1} as any);
		const second_sql = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1][1];
		expect(second_sql).toContain('WHERE created_time > ?');
	});

	it('analytics methods map rows with created_time from stamp', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{unit: 'sat', amount: 10, operation_count: 2, time_group: '2024-01-01', min_created_time: 100},
		]);
		const mints = await cdkService.getMintAnalyticsMints({type: 'sqlite'} as any);
		expect(mints[0]).toMatchObject({unit: 'sat', amount: 10, operation_count: 2, created_time: 1234567890});
	});

	it('getMintAnalyticsSwaps appends quote_id IS NULL to WHERE', async () => {
		(helpers.getAnalyticsConditions as jest.Mock).mockReturnValueOnce({where_conditions: ['unit = ?'], params: ['sat']});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{unit: 'sat', amount: 1, operation_count: 1, time_group: '2024-01-01', min_created_time: 1},
		]);
		await cdkService.getMintAnalyticsSwaps({type: 'sqlite'} as any, {units: ['sat']} as any);
		const sql = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1][1];
		expect(sql).toContain('quote_id IS NULL');
	});

	it('balances and keysets pass-through queries', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getMintBalances({} as any);
		let call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[2]).toEqual([]);

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getMintBalances({} as any, 'kid');
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('WHERE keyset_id = ?');
		expect(call[1]).toContain('AND keyset_id = ?');
		expect(call[2]).toEqual(['kid', 'kid']);

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getMintBalancesIssued({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('FROM blind_signature');

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getMintBalancesRedeemed({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('FROM proof');
		expect(call[1]).toContain("WHERE state = 'SPENT'");

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getMintKeysets({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('unit != ?');
		expect(call[2]).toEqual(['auth']);
	});
});
