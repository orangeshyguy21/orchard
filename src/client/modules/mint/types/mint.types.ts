import { 
    OrchardMintBalance,
    OrchardMintInfo,
    OrchardMintKeyset,
    OrchardMintPromise,
    OrchardMintAnalytics,
    MintUnit,
    MintAnalyticsInterval,
    OrchardMintInfoRpc,
    OrchardMintNameUpdate, 
    OrchardMintIconUpdate,
    OrchardMintDescriptionUpdate,
    OrchardMintMotdUpdate,
    OrchardMintUrlUpdate,
    OrchardMintContactUpdate,
} from "@shared/generated.types";

export type MintInfoResponse = {
  	mint_info: OrchardMintInfo;
}

export type MintInfoRpcResponse = {
	mint_info_rpc: OrchardMintInfoRpc;
}

export type MintBalancesResponse = {
  	mint_balances: OrchardMintBalance[];
      errors?: string[];
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

export type MintAnalyticsMintsResponse = {
	mint_analytics_mints: OrchardMintAnalytics[];
}

export type MintAnalyticsMeltsResponse = {
	mint_analytics_melts: OrchardMintAnalytics[];
}

export type MintAnalyticsTransfersResponse = {
	mint_analytics_transfers: OrchardMintAnalytics[];
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
    timezone?: string;
}

export type MintNameUpdateResponse = {
	mint_name_update: OrchardMintNameUpdate;
}