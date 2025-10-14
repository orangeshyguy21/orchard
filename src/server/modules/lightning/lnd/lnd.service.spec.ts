/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {LndService} from './lnd.service';
import * as grpc from '@grpc/grpc-js';

describe('LndService', () => {
	let lnd_service: LndService;
	let config_service: jest.Mocked<ConfigService>;
	let credential_service: jest.Mocked<CredentialService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LndService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadMacaroonHex: jest.fn(), loadPemOrPath: jest.fn()}},
			],
		}).compile();

		lnd_service = module.get<LndService>(LndService);
		config_service = module.get(ConfigService);
		credential_service = module.get(CredentialService);
	});

	it('should be defined', () => {
		expect(lnd_service).toBeDefined();
	});

	it('returns undefined client when credentials missing', () => {
		const client = lnd_service.initializeLightningClient();
		expect(client).toBeUndefined();
	});

	it('initializes client when credentials present', () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'lightning.host':
					return 'localhost';
				case 'lightning.port':
					return 10009;
				case 'lightning.macaroon':
					return 'hex:00';
				case 'lightning.cert':
					return 'CERT';
				default:
					return undefined as any;
			}
		});
		credential_service.loadMacaroonHex.mockReturnValue('00');
		credential_service.loadPemOrPath.mockReturnValue(Buffer.from('cert'));
		const createFromMetadataGenerator = jest.spyOn(grpc.credentials, 'createFromMetadataGenerator').mockReturnValue({} as any);
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const combine = jest.spyOn(grpc.credentials, 'combineChannelCredentials').mockReturnValue({} as any);
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		const loadPackageDefinition = jest
			.spyOn(grpc, 'loadPackageDefinition')
			.mockReturnValue({lnrpc: {Lightning: jest.fn()}, walletrpc: {WalletKit: jest.fn()}} as any);
		lnd_service.initializeLightningClient();
		lnd_service.initializeWalletKitClient();
		expect(createFromMetadataGenerator).toHaveBeenCalled();
		expect(createSsl).toHaveBeenCalled();
		expect(combine).toHaveBeenCalled();
		expect(loadSync).toHaveBeenCalled();
		expect(loadPackageDefinition).toHaveBeenCalled();
	});

	it('mapLndRequest constructs a LightningRequest', () => {
		const req = {description: 'x', expiry: 60};
		const out = lnd_service.mapLndRequest(req as any);
		expect(out.valid).toBe(true);
		expect(out.description).toBeDefined();
	});
});
