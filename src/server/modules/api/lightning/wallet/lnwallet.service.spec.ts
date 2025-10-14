/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {LightningWalletKitService} from '@server/modules/lightning/walletkit/lnwalletkit.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {LightningWalletService} from './lnwallet.service';
import {OrchardLightningAccount} from './lnwallet.model';

describe('LightningWalletService', () => {
	let lightning_wallet_service: LightningWalletService;
	let walletkit_service: jest.Mocked<LightningWalletKitService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningWalletService,
				{provide: LightningWalletKitService, useValue: {getLightningAddresses: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_wallet_service = module.get<LightningWalletService>(LightningWalletService);
		walletkit_service = module.get(LightningWalletKitService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(lightning_wallet_service).toBeDefined();
	});

	it('returns OrchardLightningAccount[] on success', async () => {
		walletkit_service.getLightningAddresses.mockResolvedValue({
			account_with_addresses: [
				{
					name: 'bech32',
					address_type: 0,
					derivation_path: '',
					addresses: [{address: 'x', is_internal: 'false', balance: 0, derivation_path: '', public_key: Buffer.alloc(0)}],
				},
			],
		} as any);
		const result = await lightning_wallet_service.getListAccounts('TAG');
		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toBeInstanceOf(OrchardLightningAccount);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		walletkit_service.getLightningAddresses.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.LightningRpcActionError);
		await expect(lightning_wallet_service.getListAccounts('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.LightningRpcActionError});
	});
});
