import {OrchardLightningInfo, OrchardLightningBalance, OrchardLightningAccount} from '@shared/generated.types';

export type LightningInfoResponse = {
	lightning_info: OrchardLightningInfo;
};

export type LightningBalanceResponse = {
	lightning_balance: OrchardLightningBalance;
};

export type LightningWalletResponse = {
	lightning_wallet: OrchardLightningAccount[];
};
