/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import {LnbitsService} from './lnbits.service';

describe('LnbitsService', () => {
	let lnbits_service: LnbitsService;
	let config_service: jest.Mocked<ConfigService>;
	let credential_service: jest.Mocked<CredentialService>;
	let fetch_service: jest.Mocked<FetchService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LnbitsService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn()}},
			],
		}).compile();

		lnbits_service = module.get<LnbitsService>(LnbitsService);
		config_service = module.get(ConfigService);
		credential_service = module.get(CredentialService);
		fetch_service = module.get(FetchService);
	});

	it('should be defined', () => {
		expect(lnbits_service).toBeDefined();
	});

	describe('initializeLightningClient', () => {
		it('should initialize successfully with valid credentials', () => {
			config_service.get.mockReturnValueOnce('http://localhost:5000'); // api_url
			config_service.get.mockReturnValueOnce('test_api_key'); // api_key
			credential_service.loadPemOrPath.mockReturnValue(Buffer.from('test_api_key'));

			const client = lnbits_service.initializeLightningClient();
			expect(client).toBe(lnbits_service);
		});

		it('should throw error with missing credentials', () => {
			config_service.get.mockReturnValue(null);

			expect(() => lnbits_service.initializeLightningClient()).toThrow('Failed to initialize LNbits client');
		});
	});

	describe('mapLnbitsRequest', () => {
		it('should map LNbits request correctly', () => {
			const lnbits_request = {
				type: 'bolt11',
				valid: true,
				description: 'Test payment',
				expires_at: 1234567890,
			};

			const result = lnbits_service.mapLnbitsRequest(lnbits_request);

			expect(result.valid).toBe(true);
			expect(result.description).toBe('Test payment');
			expect(result.expiry).toBe(1234567890);
		});
	});

	describe('mapLnbitsInfo', () => {
		it('should map LNbits info correctly', async () => {
			const lnbits_info = {
				version: '1.0.0',
				identity_pubkey: 'test_pubkey',
				alias: 'Test Node',
				block_height: 800000,
				testnet: false,
			};

			const result = await lnbits_service.mapLnbitsInfo(lnbits_info);

			expect(result.version).toBe('1.0.0');
			expect(result.identity_pubkey).toBe('test_pubkey');
			expect(result.alias).toBe('Test Node');
			expect(result.block_height).toBe(800000);
			expect(result.testnet).toBe(false);
			expect(result.num_active_channels).toBe(0); // LNbits no maneja canales
		});
	});

	describe('mapLnbitsChannelBalance', () => {
		it('should map LNbits balance correctly', async () => {
			const balance = 100000; // 100k sats

			const result = await lnbits_service.mapLnbitsChannelBalance(balance);

			expect(result.balance).toBe('100000');
			expect(result.local_balance.sat).toBe('100000');
			expect(result.local_balance.msat).toBe('100000000');
			expect(result.remote_balance.sat).toBe('0');
		});
	});

	describe('mapLnbitsAddresses', () => {
		it('should map bitcoin address correctly', async () => {
			const address = 'bc1qtest123456789abcdef';

			const result = await lnbits_service.mapLnbitsAddresses(address);

			expect(result.account_with_addresses).toHaveLength(1);
			expect(result.account_with_addresses[0].addresses[0].address).toBe(address);
			expect(result.account_with_addresses[0].name).toBe('LNbits Onchain');
		});
	});
});