import {
	OrchardLightningInfo,
	OrchardLightningBalance,
	OrchardLightningAccount,
	OrchardLightningRequest,
	OrchardLightningAnalytics,
	OrchardLightningAnalyticsBackfillStatus,
	LightningAnalyticsInterval,
	LightningAnalyticsMetric,
} from '@shared/generated.types';

export type LightningInfoResponse = {
	lightning_info: OrchardLightningInfo;
};

export type LightningBalanceResponse = {
	lightning_balance: OrchardLightningBalance;
};

export type LightningWalletResponse = {
	lightning_wallet: OrchardLightningAccount[];
};

export type LightningRequestResponse = {
	lightning_request: OrchardLightningRequest;
};

export type LightningAnalyticsResponse = {
	lightning_analytics: OrchardLightningAnalytics[];
};

export type LightningAnalyticsArgs = {
	date_start?: number;
	date_end?: number;
	interval?: LightningAnalyticsInterval;
	timezone?: string;
	metrics?: LightningAnalyticsMetric[];
};

export type LightningAnalyticsBackfillStatusResponse = {
	lightning_analytics_backfill_status: OrchardLightningAnalyticsBackfillStatus;
};
