import {
	OrchardLightningInfo,
	OrchardLightningBalance,
	OrchardLightningAccount,
	OrchardLightningChannel,
	OrchardLightningClosedChannel,
	OrchardLightningRequest,
	OrchardLightningAnalytics,
	OrchardAnalyticsBackfillStatus,
	AnalyticsInterval,
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

export type LightningChannelsResponse = {
	lightning_channels: OrchardLightningChannel[];
};

export type LightningClosedChannelsResponse = {
	lightning_closed_channels: OrchardLightningClosedChannel[];
};

export type LightningRequestResponse = {
	lightning_request: OrchardLightningRequest;
};

export type LightningAnalyticsLocalBalanceResponse = {
	lightning_analytics_local_balance: OrchardLightningAnalytics[];
};

export type LightningAnalyticsArgs = {
	date_start?: number;
	date_end?: number;
	interval?: AnalyticsInterval;
	timezone?: string;
};

export type LightningAnalyticsBackfillStatusResponse = {
	lightning_analytics_backfill_status: OrchardAnalyticsBackfillStatus;
};
