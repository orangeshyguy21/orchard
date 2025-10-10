/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {LightningInfoService} from './lninfo.service';
import {OrchardLightningInfo} from './lninfo.model';

describe('LightningInfoService', () => {
	let lightning_info_service: LightningInfoService;
	let lightning_service: jest.Mocked<LightningService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningInfoService,
				{provide: LightningService, useValue: {getLightningInfo: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_info_service = module.get<LightningInfoService>(LightningInfoService);
		lightning_service = module.get(LightningService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(lightning_info_service).toBeDefined();
	});

	it('returns OrchardLightningInfo on success', async () => {
		// Arrange
		const rpc_info: any = {
			version: 'v',
			commit_hash: '',
			identity_pubkey: 'pub',
			alias: 'alias',
			color: '#000000',
			num_pending_channels: 0,
			num_active_channels: 0,
			num_inactive_channels: 0,
			num_peers: 0,
			block_height: 0,
			block_hash: '',
			best_header_timestamp: 0,
			synced_to_chain: true,
			synced_to_graph: true,
			testnet: false,
			chains: [],
			uris: [],
			require_htlc_interceptor: false,
			store_final_htlc_resolutions: false,
			features: {},
		};
		lightning_service.getLightningInfo.mockResolvedValue(rpc_info);

		// Act
		const result = await lightning_info_service.getLightningInfo('TAG');

		// Assert
		expect(result).toBeInstanceOf(OrchardLightningInfo);
		expect(lightning_service.getLightningInfo).toHaveBeenCalledTimes(1);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		// Arrange
		const rpc_error = new Error('boom');
		lightning_service.getLightningInfo.mockRejectedValue(rpc_error);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.LightningRpcActionError);

		// Act
		await expect(lightning_info_service.getLightningInfo('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);

		// Assert
		expect(error_service.resolveError).toHaveBeenCalled();
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.LightningRpcActionError});
	});
});
