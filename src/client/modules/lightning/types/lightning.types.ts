import { OrchardLightningInfo, OrchardLightningBalance } from "@shared/generated.types";

export type LightningInfoResponse = {
    lightning_info: OrchardLightningInfo;
}

export type LightningBalanceResponse = {
    lightning_balance: OrchardLightningBalance;
}