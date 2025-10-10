/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {ClnService} from './cln.service';
import * as grpc from '@grpc/grpc-js';

describe('ClnService', () => {
	let cln_service: ClnService;
	let config_service: jest.Mocked<ConfigService>;
	let credential_service: jest.Mocked<CredentialService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ClnService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
			],
		}).compile();

		cln_service = module.get<ClnService>(ClnService);
		config_service = module.get(ConfigService);
		credential_service = module.get(CredentialService);
	});

	it('should be defined', () => {
		expect(cln_service).toBeDefined();
	});

	it('returns undefined client when credentials missing', () => {
		const client = cln_service.initializeLightningClient();
		expect(client).toBeUndefined();
	});

	it('initializes mTLS client when credentials present', () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'lightning.host':
					return 'cln';
				case 'lightning.port':
					return 9999;
				case 'lightning.cert':
					return 'CERT';
				case 'lightning.key':
					return 'KEY';
				case 'lightning.ca':
					return 'CA';
				default:
					return undefined as any;
			}
		});
		credential_service.loadPemOrPath.mockReturnValue(Buffer.from('x'));
		const createSsl = jest.spyOn(grpc.credentials, 'createSsl').mockReturnValue({} as any);
		const loadSync = jest.spyOn(require('@grpc/proto-loader'), 'loadSync').mockReturnValue({} as any);
		const loadPackageDefinition = jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({cln: {Node: jest.fn()}} as any);
		cln_service.initializeLightningClient();
		expect(createSsl).toHaveBeenCalled();
		expect(loadSync).toHaveBeenCalled();
		expect(loadPackageDefinition).toHaveBeenCalled();
	});

	it('mapClnInfo maps fields and uris correctly', async () => {
		const info = {
			id: Buffer.from('aabb', 'hex'),
			color: '#AABBCC',
			network: 'regtest',
			address: [{address: '127.0.0.1', port: 9735}],
			version: 'v',
			alias: 'my',
			num_pending_channels: 1,
			num_active_channels: 2,
			num_inactive_channels: 3,
			num_peers: 4,
			blockheight: 5,
		};
		const out = await cln_service.mapClnInfo(info);
		expect(out.identity_pubkey).toBe('aabb');
		expect(out.color).toBe('aabbcc');
		expect(out.testnet).toBe(true);
		expect(out.uris[0]).toMatch(/@127.0.0.1:9735$/);
	});

	it('mapClnAddresses groups bech32 and p2tr', () => {
		const addresses = {
			addresses: [{bech32: 'b1'}, {p2tr: 't1'}],
		};
		const out = cln_service.mapClnAddresses(addresses);
		expect(out.account_with_addresses.length).toBe(2);
		expect(out.account_with_addresses[0].addresses[0].address).toBeDefined();
	});

	it('mapClnRequest maps validity and description', () => {
		const req = {item_type: 'offer', valid: true, description: 'hello'};
		const out = cln_service.mapClnRequest(req);
		expect(out.valid).toBe(true);
		expect(out.description).toBeDefined();
	});
});
