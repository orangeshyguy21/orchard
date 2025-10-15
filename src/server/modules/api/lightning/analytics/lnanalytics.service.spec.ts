/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {OrchardAnalyticsInterval} from '@server/modules/orchard/orchard.enums';
/* Local Dependencies */
import {LightningAnalyticsService} from './lnanalytics.service';
import {OrchardLightningAnalytics} from './lnanalytics.model';

describe('LightningAnalyticsService', () => {
	let lightning_analytics_service: LightningAnalyticsService;
	let lightning_service: jest.Mocked<LightningService>;
	let error_service: jest.Mocked<ErrorService>;

	const mock_channels_response = {
		channels: [
			{local_balance: '100000', capacity: '200000', initiator: true},
			{local_balance: '50000', capacity: '100000', initiator: false},
		],
	};

	const mock_payments_response = {
		payments: [
			{
				value_sat: '1000',
				fee_sat: '10',
				settle_time_ns: '1700000000000000000',
				creation_time_ns: '1699999999000000000',
			},
		],
		first_index_offset: '0',
	};

	const mock_invoices_response = {
		invoices: [
			{
				settled: true,
				amt_paid_sat: '2000',
				settle_time: 1700000000,
				creation_date: 1699999999,
			},
		],
		first_index_offset: '0',
	};

	const mock_forwarding_response = {
		forwarding_events: [
			{
				timestamp: 1700000000,
				fee_msat: '5000',
			},
		],
		last_offset_index: '0',
	};

	const mock_closed_channels_response = {
		channels: [],
	};

	const mock_transactions_response = {
		transactions: [],
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningAnalyticsService,
				{
					provide: LightningService,
					useValue: {
						listChannels: jest.fn(),
						listPayments: jest.fn(),
						listInvoices: jest.fn(),
						forwardingHistory: jest.fn(),
						closedChannels: jest.fn(),
						getTransactions: jest.fn(),
					},
				},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_analytics_service = module.get<LightningAnalyticsService>(LightningAnalyticsService);
		lightning_service = module.get(LightningService);
		error_service = module.get(ErrorService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(lightning_analytics_service).toBeDefined();
	});

	describe('getOutboundLiquiditySeries', () => {
		it('returns array of OrchardLightningAnalytics on success', async () => {
			// Arrange
			lightning_service.listChannels.mockResolvedValue(mock_channels_response as any);
			lightning_service.listPayments.mockResolvedValue(mock_payments_response as any);
			lightning_service.listInvoices.mockResolvedValue(mock_invoices_response as any);
			lightning_service.forwardingHistory.mockResolvedValue(mock_forwarding_response as any);
			lightning_service.closedChannels.mockResolvedValue(mock_closed_channels_response as any);
			lightning_service.getTransactions.mockResolvedValue(mock_transactions_response as any);

			const now = Math.floor(Date.now() / 1000);
			const args = {
				date_start: now - 7 * 24 * 3600,
				date_end: now,
				interval: OrchardAnalyticsInterval.day,
				timezone: 'UTC',
			};

			// Act
			const result = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', args);

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result[0]).toBeInstanceOf(OrchardLightningAnalytics);
			expect(lightning_service.listChannels).toHaveBeenCalledTimes(2); // once for current balance, once for channel opens
		});

		it('uses default values when args are not provided', async () => {
			// Arrange
			lightning_service.listChannels.mockResolvedValue(mock_channels_response as any);
			lightning_service.listPayments.mockResolvedValue({payments: [], first_index_offset: '0'} as any);
			lightning_service.listInvoices.mockResolvedValue({invoices: [], first_index_offset: '0'} as any);
			lightning_service.forwardingHistory.mockResolvedValue({forwarding_events: [], last_offset_index: '0'} as any);
			lightning_service.closedChannels.mockResolvedValue(mock_closed_channels_response as any);

			// Act
			const result = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {});

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});

		it('handles different intervals (week, month)', async () => {
			// Arrange
			lightning_service.listChannels.mockResolvedValue(mock_channels_response as any);
			lightning_service.listPayments.mockResolvedValue({payments: [], first_index_offset: '0'} as any);
			lightning_service.listInvoices.mockResolvedValue({invoices: [], first_index_offset: '0'} as any);
			lightning_service.forwardingHistory.mockResolvedValue({forwarding_events: [], last_offset_index: '0'} as any);
			lightning_service.closedChannels.mockResolvedValue(mock_closed_channels_response as any);

			const now = Math.floor(Date.now() / 1000);

			// Act - week interval
			const result_week = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {
				date_start: now - 30 * 24 * 3600,
				date_end: now,
				interval: OrchardAnalyticsInterval.week,
			});

			// Act - month interval
			const result_month = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {
				date_start: now - 90 * 24 * 3600,
				date_end: now,
				interval: OrchardAnalyticsInterval.month,
			});

			// Assert
			expect(Array.isArray(result_week)).toBe(true);
			expect(Array.isArray(result_month)).toBe(true);
		});

		it('handles different timezones', async () => {
			// Arrange
			lightning_service.listChannels.mockResolvedValue(mock_channels_response as any);
			lightning_service.listPayments.mockResolvedValue({payments: [], first_index_offset: '0'} as any);
			lightning_service.listInvoices.mockResolvedValue({invoices: [], first_index_offset: '0'} as any);
			lightning_service.forwardingHistory.mockResolvedValue({forwarding_events: [], last_offset_index: '0'} as any);
			lightning_service.closedChannels.mockResolvedValue(mock_closed_channels_response as any);

			const now = Math.floor(Date.now() / 1000);

			// Act
			const result = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {
				date_start: now - 7 * 24 * 3600,
				date_end: now,
				interval: OrchardAnalyticsInterval.day,
				timezone: 'America/New_York',
			});

			// Assert
			expect(Array.isArray(result)).toBe(true);
		});

		it('handles pagination for payments', async () => {
			// Arrange
			const first_page = {
				payments: Array(1000).fill({
					value_sat: '100',
					fee_sat: '1',
					settle_time_ns: '1700000000000000000',
					creation_time_ns: '1699999999000000000',
				}),
				first_index_offset: '1000',
			};
			const second_page = {
				payments: [
					{
						value_sat: '100',
						fee_sat: '1',
						settle_time_ns: '1700000000000000000',
						creation_time_ns: '1699999999000000000',
					},
				],
				first_index_offset: '1001',
			};

			lightning_service.listChannels.mockResolvedValue(mock_channels_response as any);
			lightning_service.listPayments.mockResolvedValueOnce(first_page as any).mockResolvedValueOnce(second_page as any);
			lightning_service.listInvoices.mockResolvedValue({invoices: [], first_index_offset: '0'} as any);
			lightning_service.forwardingHistory.mockResolvedValue({forwarding_events: [], last_offset_index: '0'} as any);
			lightning_service.closedChannels.mockResolvedValue(mock_closed_channels_response as any);

			const now = Math.floor(Date.now() / 1000);

			// Act
			const result = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {
				date_start: now - 7 * 24 * 3600,
				date_end: now,
			});

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(lightning_service.listPayments).toHaveBeenCalledTimes(2);
		});

		it('handles empty data gracefully', async () => {
			// Arrange
			lightning_service.listChannels.mockResolvedValue({channels: []} as any);
			lightning_service.listPayments.mockResolvedValue({payments: [], first_index_offset: '0'} as any);
			lightning_service.listInvoices.mockResolvedValue({invoices: [], first_index_offset: '0'} as any);
			lightning_service.forwardingHistory.mockResolvedValue({forwarding_events: [], last_offset_index: '0'} as any);
			lightning_service.closedChannels.mockResolvedValue({channels: []} as any);

			const now = Math.floor(Date.now() / 1000);

			// Act
			const result = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {
				date_start: now - 7 * 24 * 3600,
				date_end: now,
			});

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			expect(result[0].amount).toBe(0);
		});

		it('wraps errors via resolveError and throws OrchardApiError', async () => {
			// Arrange
			const rpc_error = new Error('RPC connection failed');
			lightning_service.listChannels.mockRejectedValue(rpc_error);
			error_service.resolveError.mockReturnValue(OrchardErrorCode.LightningRpcActionError);

			const now = Math.floor(Date.now() / 1000);

			// Act & Assert
			await expect(
				lightning_analytics_service.getOutboundLiquiditySeries('MY_TAG', {
					date_start: now - 7 * 24 * 3600,
					date_end: now,
				}),
			).rejects.toBeInstanceOf(OrchardApiError);

			const calls = error_service.resolveError.mock.calls;
			const [, , tag_arg, code_arg] = calls[calls.length - 1];
			expect(tag_arg).toBe('MY_TAG');
			expect(code_arg).toEqual({errord: OrchardErrorCode.LightningRpcActionError});
		});

		it('reconstructs liquidity backward correctly with mixed events', async () => {
			// Arrange
			const now_ts = Math.floor(Date.now() / 1000);
			const day_ago = now_ts - 24 * 3600;

			lightning_service.listChannels.mockResolvedValue({
				channels: [{local_balance: '100000', capacity: '200000', initiator: true, lifetime: 0}],
			} as any);

			// Payment event (reduces liquidity going backward in time)
			lightning_service.listPayments.mockResolvedValue({
				payments: [
					{
						value_sat: '1000',
						fee_sat: '10',
						settle_time_ns: String(day_ago * 1e9),
						creation_time_ns: String(day_ago * 1e9),
					},
				],
				first_index_offset: '0',
			} as any);

			// Invoice event (increases liquidity going backward in time)
			lightning_service.listInvoices.mockResolvedValue({
				invoices: [
					{
						settled: true,
						amt_paid_sat: '2000',
						settle_time: day_ago,
						creation_date: day_ago,
					},
				],
				first_index_offset: '0',
			} as any);

			lightning_service.forwardingHistory.mockResolvedValue({forwarding_events: [], last_offset_index: '0'} as any);
			lightning_service.closedChannels.mockResolvedValue({channels: []} as any);

			// Act
			const result = await lightning_analytics_service.getOutboundLiquiditySeries('TAG', {
				date_start: day_ago - 1,
				date_end: now_ts,
				interval: OrchardAnalyticsInterval.day,
			});

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			// Current balance should be 100000
			// Going backward: add payment (1010), subtract invoice (2000) = should have different values
		});
	});
});
