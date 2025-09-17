import {OrchardLightningInfo, OrchardLightningBalance, OrchardLightningAccount, OrchardLightningRequest} from '@shared/generated.types';

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
