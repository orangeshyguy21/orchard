/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {LightningRequestService} from './lnrequest.service';
import {OrchardLightningRequest} from './lnrequest.model';

describe('LightningRequestService', () => {
	let lightning_request_service: LightningRequestService;
	let lightning_service: jest.Mocked<LightningService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningRequestService,
				{provide: LightningService, useValue: {getLightningRequest: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_request_service = module.get<LightningRequestService>(LightningRequestService);
		lightning_service = module.get(LightningService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(lightning_request_service).toBeDefined();
	});

	it('returns OrchardLightningRequest on success', async () => {
		// Arrange
		lightning_service.getLightningRequest.mockResolvedValue({} as any);

		// Act
		const result = await lightning_request_service.getLightningRequest('TAG', 'REQ');

		// Assert
		expect(result).toBeInstanceOf(OrchardLightningRequest);
		expect(lightning_service.getLightningRequest).toHaveBeenCalledWith('REQ');
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		// Arrange
		const rpc_error = new Error('boom');
		lightning_service.getLightningRequest.mockRejectedValue(rpc_error);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.LightningRpcActionError);

		// Act
		await expect(lightning_request_service.getLightningRequest('MY_TAG', 'REQ')).rejects.toBeInstanceOf(OrchardApiError);

		// Assert
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.LightningRpcActionError});
	});
});
