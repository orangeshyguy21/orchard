/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {LightningAnalyticsService} from '@server/modules/lightning/analytics/lnanalytics.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {LightningAnalyticsMetric} from '@server/modules/lightning/analytics/lnanalytics.enums';
/* Local Dependencies */
import {ApiLightningAnalyticsService} from './lnanalytics.service';
import {OrchardLightningAnalyticsBackfillStatus} from './lnanalytics.model';

describe('ApiLightningAnalyticsService', () => {
	let service: ApiLightningAnalyticsService;
	let lightningAnalyticsService: jest.Mocked<LightningAnalyticsService>;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ApiLightningAnalyticsService,
				{provide: LightningAnalyticsService, useValue: {getCachedAnalytics: jest.fn(), getBackfillStatus: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		service = module.get<ApiLightningAnalyticsService>(ApiLightningAnalyticsService);
		lightningAnalyticsService = module.get(LightningAnalyticsService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('returns backfill status', () => {
		lightningAnalyticsService.getBackfillStatus.mockReturnValue({is_running: false});

		const result = service.getBackfillStatus('TAG');

		expect(result).toBeDefined();
		expect(result.is_running).toBe(false);
	});

	it('wraps getBackfillStatus errors via resolveError and throws OrchardApiError', () => {
		lightningAnalyticsService.getBackfillStatus.mockImplementation(() => {
			throw new Error('boom');
		});
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.LightningRpcActionError});

		expect(() => service.getBackfillStatus('TAG')).toThrow(OrchardApiError);
	});

	it('wraps getAnalytics errors via resolveError and throws OrchardApiError', async () => {
		lightningAnalyticsService.getCachedAnalytics.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.LightningRpcActionError});

		await expect(service.getAnalytics('TAG', {})).rejects.toBeInstanceOf(OrchardApiError);
	});
});
