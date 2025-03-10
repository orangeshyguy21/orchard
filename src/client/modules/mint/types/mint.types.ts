import { OrchardMintBalance, OrchardMintInfo, OrchardMintKeyset, OrchardMintPromise, OrchardMintAnalytics, MintUnit, MintAnalyticsInterval } from "@shared/generated.types";

export type MintInfoResponse = {
  	mint_info: OrchardMintInfo;
}

export type MintBalancesResponse = {
  	mint_balances: OrchardMintBalance[];
}

export type MintKeysetsResponse = {
  	mint_keysets: OrchardMintKeyset[];
}

export type MintPromisesResponse = {
  	mint_promises: OrchardMintPromise[];
}

export type MintAnalyticsBalancesResponse = {
	mint_analytics_balances: OrchardMintAnalytics[];
}

export type MintPromisesArgs ={
    id_keysets?: string[];
    date_start?: number;
    date_end?: number;
}

export type MintAnalyticsArgs = {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    interval?: MintAnalyticsInterval;
}