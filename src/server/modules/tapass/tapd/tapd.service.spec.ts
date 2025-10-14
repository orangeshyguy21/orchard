/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {TapdService} from './tapd.service';
import * as grpc from '@grpc/grpc-js';

describe('TapdService', () => {
	let tapd_service: TapdService;
	let config_service: jest.Mocked<ConfigService>;
	let credential_service: jest.Mocked<CredentialService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TapdService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadMacaroonHex: jest.fn(), loadPemOrPath: jest.fn()}},
			],
		}).compile();

		tapd_service = module.get<TapdService>(TapdService);
		config_service = module.get(ConfigService);
		credential_service = module.get(CredentialService);
	});

	it('should be defined', () => {
		expect(tapd_service).toBeDefined();
	});

	it('returns undefined client when credentials missing', () => {
		config_service.get.mockReturnValueOnce(undefined);
		config_service.get.mockReturnValueOnce(undefined);
		config_service.get.mockReturnValueOnce(undefined);
		config_service.get.mockReturnValueOnce(undefined);
		const client = tapd_service.initializeTaprootAssetsClient();
		expect(client).toBeUndefined();
	});

	it('initializes client when credentials present', () => {
		// Provide config
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'taproot_assets.host':
					return 'localhost';
				case 'taproot_assets.port':
					return 10029;
				case 'taproot_assets.macaroon':
					return 'hex:00';
				case 'taproot_assets.cert':
					return '-----BEGIN CERT-----\nX\n-----END CERT-----';
				default:
					return undefined as any;
			}
		});
		credential_service.loadMacaroonHex.mockReturnValue('00');
		credential_service.loadPemOrPath.mockReturnValue(Buffer.from('cert'));

		// Spy on grpc to avoid real calls
		const metadata_add = jest.spyOn((grpc.Metadata as any).prototype, 'add').mockImplementation(() => undefined);
		const createFromMetadataGenerator = jest.spyOn(grpc.credentials, 'createFromMetadataGenerator').mockReturnValue({} as any);
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const combine = jest.spyOn(grpc.credentials, 'combineChannelCredentials').mockReturnValue({} as any);

		// Mock loadPackageDefinition -> namespace and client constructor
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		const client_ctor = jest.fn();
		const loadPackageDefinition = jest
			.spyOn(grpc, 'loadPackageDefinition')
			.mockReturnValue({taprpc: {TaprootAssets: client_ctor}} as any);

		tapd_service.initializeTaprootAssetsClient();

		expect(createFromMetadataGenerator).toHaveBeenCalled();
		expect(createSsl).toHaveBeenCalled();
		expect(combine).toHaveBeenCalled();
		expect(loadSync).toHaveBeenCalled();
		expect(loadPackageDefinition).toHaveBeenCalled();
		expect(client_ctor).toHaveBeenCalled();
		metadata_add.mockRestore();
	});
});
