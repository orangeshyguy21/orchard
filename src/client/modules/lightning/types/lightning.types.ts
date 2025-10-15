import {
	OrchardLightningInfo,
	OrchardLightningBalance,
	OrchardLightningAccount,
	OrchardLightningRequest,
	OrchardLightningAnalytics,
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

export type LightningAnalyticsOutboundResponse = {
	lightning_analytics_outbound: OrchardLightningAnalytics[];
};

export type LightningAnalyticsArgs = {
	date_start?: number;
	date_end?: number;
	// interval?: MintAnalyticsInterval; this needs to be OrchardAnalyticsInterval
	timezone?: string;
};
