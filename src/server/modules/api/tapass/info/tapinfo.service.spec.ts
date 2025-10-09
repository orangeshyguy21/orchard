/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {TaprootAssetsService} from '@server/modules/tapass/tapass/tapass.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {TaprootAssetsInfoService} from './tapinfo.service';
import {OrchardTaprootAssetsInfo} from './tapinfo.model';

describe('TaprootAssetsInfoService', () => {
	let taproot_assets_info_service: TaprootAssetsInfoService;
	let tap_service: jest.Mocked<TaprootAssetsService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsInfoService,
				{provide: TaprootAssetsService, useValue: {getTaprootAssetsInfo: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		taproot_assets_info_service = module.get<TaprootAssetsInfoService>(TaprootAssetsInfoService);
		tap_service = module.get(TaprootAssetsService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(taproot_assets_info_service).toBeDefined();
	});

	it('returns OrchardTaprootAssetsInfo on success', async () => {
		tap_service.getTaprootAssetsInfo.mockResolvedValue({} as any);
		const result = await taproot_assets_info_service.getTaprootAssetsInfo('TAG');
		expect(result).toBeInstanceOf(OrchardTaprootAssetsInfo);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		tap_service.getTaprootAssetsInfo.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.TaprootAssetsRpcActionError);
		await expect(taproot_assets_info_service.getTaprootAssetsInfo('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.TaprootAssetsRpcActionError});
	});
});
