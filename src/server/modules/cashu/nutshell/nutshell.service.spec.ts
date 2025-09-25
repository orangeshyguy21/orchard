/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
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

	it('getMintKeysets converts dates and derives path index', async () => {
		(helpers.queryRows as jest.Mock).mockResolvedValueOnce([
			{valid_from: '2024-01-01', valid_to: '2024-01-02', derivation_path: "m/86'/0'/0'"},
		]);
		const out = await nutshell_service.getMintKeysets({} as any);
		expect(out[0].valid_from).toBe(1);
		expect(out[0].valid_to).toBe(1);
		expect(out[0].derivation_path_index).toBe(0);
	});
});
