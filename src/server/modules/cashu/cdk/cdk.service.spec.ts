/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
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
	let cdk_service: CdkService;
	let config_service: jest.Mocked<ConfigService>;
	let credential_service: jest.Mocked<CredentialService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CdkService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
			],
		}).compile();

		cdk_service = module.get<CdkService>(CdkService);
		config_service = module.get(ConfigService) as any;
		credential_service = module.get(CredentialService) as any;
	});

	it('should be defined', () => {
		expect(cdk_service).toBeDefined();
	});

	it('returns undefined client when credentials missing', () => {
		const client = cdk_service.initializeGrpcClient();
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
		const loadPackageDefinition = jest
			.spyOn(grpc, 'loadPackageDefinition')
			.mockReturnValue({cdk_mint_rpc: {CdkMint: jest.fn()}} as any);
		cdk_service.initializeGrpcClient();
		expect(createSsl).toHaveBeenCalled();
		expect(loadSync).toHaveBeenCalled();
		expect(loadPackageDefinition).toHaveBeenCalled();
	});

	it('getMintMeltQuotes maps request using extractRequestString', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{id: 'q1', request: 'bolt11:lnbc123', unit: 'sat', state: 'PAID', created_time: 1},
		]);
		const out = await cdk_service.getMintMeltQuotes({} as any);
		expect(out[0].request).toBe('lnbc123');
	});

	it('getMintProofGroups groups amounts and sums', async () => {
		(helpers.buildDynamicQuery as jest.Mock).mockReturnValue({sql: 'SQL', params: []});
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{created_time: 10, keyset_id: 'k1', unit: 'sat', state: 'SPENT', amounts: '[1,2]'},
			{created_time: 10, keyset_id: 'k2', unit: 'sat', state: 'SPENT', amounts: '[3]'},
		]);
		const out = await cdk_service.getMintProofGroups({} as any);
		expect(out).toHaveLength(1);
		expect(out[0].amount).toBe(6);
		expect(out[0].keyset_ids).toEqual(['k1', 'k2']);
	});
});
