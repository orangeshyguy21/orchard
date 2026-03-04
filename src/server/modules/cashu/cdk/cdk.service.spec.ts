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
			.mockReturnValue({cdk_mint_management_v1: {CdkMint: jest.fn()}} as any);
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
		jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cdk_mint_management_v1: {CdkMint: CdkMintMock}} as any);
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
		jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cdk_mint_management_v1: {CdkMint: CdkMintMock}} as any);
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

	it('listMeltQuotes maps request using extractRequestString', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{id: 'q1', request: 'bolt11:lnbc123', unit: 'sat', state: 'PAID', created_time: 1},
		]);
		const out = await cdkService.listMeltQuotes({} as any);
		expect(out[0].request).toBe('lnbc123');
	});

	it('listMeltQuotes leaves request unchanged when extractRequestString falsy', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{id: 'q1', request: 'nostr:xyz', unit: 'sat', state: 'PAID', created_time: 1},
		]);
		(helpers.extractRequestString as jest.Mock).mockReturnValueOnce('');
		const out = await cdkService.listMeltQuotes({} as any);
		expect(out[0].request).toBe('nostr:xyz');
	});

	it('listMeltQuotes propagates query error', async () => {
		(helpers.queryRows as jest.Mock).mockRejectedValueOnce(new Error('fail'));
		await expect(cdkService.listMeltQuotes({} as any)).rejects.toThrow('fail');
	});

	it('listProofGroups groups amounts and sums', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: '[1,2]'},
			{created_time: 10, keyset_id: 'k2', unit: 'sat', state: 'SPENT', amounts: '[3]'},
		]);
		const out = await cdkService.listProofGroups({} as any);
		expect(out).toHaveLength(1);
		expect(out[0].amount).toBe(6);
		expect(out[0].keyset_ids).toEqual(['k1', 'k2']);
	});

	it('listProofGroups supports array amounts, multiple groups and empty input', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: [1]},
			{created_time: 10, keyset_id: 'k2', unit: 'sat', state: 'SPENT', amounts: '[2]'},
			{created_time: 11, keyset_id: 'k9', unit: 'sat', state: 'SPENT', amounts: '[3]'},
		]);
		const out = await cdkService.listProofGroups({} as any);
		expect(out).toHaveLength(2);
		const g1 = out.find((g) => g.created_time === 10);
		expect(g1.amount).toBe(3);
		const g2 = out.find((g) => g.created_time === 11);
		expect(g2.amount).toBe(3);

		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([]);
		const empty = await cdkService.listProofGroups({} as any);
		expect(empty).toEqual([]);
	});

	it('listProofGroups rejects on invalid JSON amounts', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: 'not-json'},
		]);
		await expect(cdkService.listProofGroups({} as any)).rejects.toThrow();
	});

	it('countMintQuotes and countMeltQuotes return row.count', async () => {
		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT 1;', params: ['a']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 7});
		await expect(cdkService.countMintQuotes({} as any)).resolves.toBe(7);

		(helpers.buildCountQuery as jest.Mock).mockReturnValueOnce({sql: 'SELECT 2;', params: ['b']});
		(helpers.queryRow as jest.Mock).mockResolvedValueOnce({count: 5});
		await expect(cdkService.countMeltQuotes({} as any)).resolves.toBe(5);
	});

	it('balances and keysets pass-through queries', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getBalances({} as any);
		let call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[2]).toEqual([]);

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getBalances({} as any, 'kid');
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('WHERE ka.keyset_id = ?');
		expect(call[2]).toEqual(['kid']);

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getBalancesIssued({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('total_issued AS balance');
		expect(call[1]).toContain('FROM keyset_amounts');

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getBalancesRedeemed({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('total_redeemed AS balance');
		expect(call[1]).toContain('FROM keyset_amounts');

		(helpers.queryRows as jest.Mock).mockResolvedValue([]);
		await cdkService.getKeysets({} as any);
		call = (helpers.queryRows as jest.Mock).mock.calls[(helpers.queryRows as jest.Mock).mock.calls.length - 1];
		expect(call[1]).toContain('unit != ?');
		expect(call[2]).toEqual(['auth']);
	});
});
