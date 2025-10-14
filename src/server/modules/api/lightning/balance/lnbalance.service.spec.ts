/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {LightningBalanceService} from './lnbalance.service';
import {OrchardLightningBalance} from './lnbalance.model';

describe('LightningBalanceService', () => {
	let lightning_balance_service: LightningBalanceService;
	let lightning_service: jest.Mocked<LightningService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningBalanceService,
				{provide: LightningService, useValue: {getLightningChannelBalance: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_balance_service = module.get<LightningBalanceService>(LightningBalanceService);
		lightning_service = module.get(LightningService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(lightning_balance_service).toBeDefined();
	});

	it('returns OrchardLightningBalance on success', async () => {
		// Arrange: minimal valid LightningChannelBalance shape
		lightning_service.getLightningChannelBalance.mockResolvedValue({
			balance: '0',
			pending_open_balance: '0',
			local_balance: {sat: '0', msat: '0'},
			remote_balance: {sat: '0', msat: '0'},
			unsettled_local_balance: {sat: '0', msat: '0'},
			unsettled_remote_balance: {sat: '0', msat: '0'},
			pending_open_local_balance: {sat: '0', msat: '0'},
			pending_open_remote_balance: {sat: '0', msat: '0'},
			custom_channel_data: Buffer.alloc(0),
		} as any);

		// Act
		const result = await lightning_balance_service.getLightningChannelBalance('TAG');

		// Assert
		expect(result).toBeInstanceOf(OrchardLightningBalance);
		expect(lightning_service.getLightningChannelBalance).toHaveBeenCalledTimes(1);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		// Arrange
		const rpc_error = new Error('boom');
		lightning_service.getLightningChannelBalance.mockRejectedValue(rpc_error);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.LightningRpcActionError);

		// Act
		await expect(lightning_balance_service.getLightningChannelBalance('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);

		// Assert
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.LightningRpcActionError});
	});
});
