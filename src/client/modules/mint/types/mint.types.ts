import { 
    OrchardMintBalance,
    OrchardMintInfo,
    OrchardMintQuoteTtls,
    OrchardMintKeyset,
    OrchardMintPromise,
    OrchardMintAnalytics,
    OrchardMintMintQuote,
    OrchardMintMeltQuote,
    MintUnit,
    MintAnalyticsInterval,
    MintQuoteState,
    MeltQuoteState,
    OrchardMintInfoRpc,
    OrchardMintNameUpdate, 
    OrchardMintIconUpdate,
    OrchardMintDescriptionUpdate,
    OrchardMintMotdUpdate,
    OrchardMintUrlUpdate,
    OrchardMintContactUpdate,
    OrchardMintNut04Update,
    OrchardMintNut05Update,
} from "@shared/generated.types";

export type MintInfoResponse = {
  	mint_info: OrchardMintInfo;
}

export type MintInfoRpcResponse = {
	mint_info_rpc: OrchardMintInfoRpc;
}

export type MintQuoteTtlsResponse = {
	mint_quote_ttl: OrchardMintQuoteTtls;
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

export type MintMintQuotesResponse = {
	mint_mint_quotes: OrchardMintMintQuote[];
}

export type MintMeltQuotesResponse = {
	mint_melt_quotes: OrchardMintMeltQuote[];
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

export type MintMintQuotesArgs = {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    state?: MintQuoteState;
    timezone?: string;
}

export type MintMeltQuotesArgs = {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    state?: MeltQuoteState;
    timezone?: string;
}

export type MintNameUpdateResponse = {
	mint_name_update: OrchardMintNameUpdate;
}

export type MintDescriptionUpdateResponse = {
	mint_short_description_update: OrchardMintDescriptionUpdate;
}

export type MintDescriptionLongUpdateResponse = {
	mint_long_description_update: OrchardMintDescriptionUpdate;
}

export type MintIconUrlUpdateResponse = {
	mint_icon_update: OrchardMintIconUpdate;
}

export type MintMotdUpdateResponse = {
	mint_motd_update: OrchardMintMotdUpdate;
}

export type MintUrlUpdateResponse = {
	mint_url_add: OrchardMintUrlUpdate;
	mint_url_remove: OrchardMintUrlUpdate;
}

export type MintUrlAddResponse = {
	mint_url_add: OrchardMintUrlUpdate;
}

export type MintUrlRemoveResponse = {
	mint_url_remove: OrchardMintUrlUpdate;
}

export type MintContactUpdateResponse = {
	mint_contact_add: OrchardMintContactUpdate;
	mint_contact_remove: OrchardMintContactUpdate;
}

export type MintContactRemoveResponse = {
	mint_contact_remove: OrchardMintContactUpdate;
}

export type MintContactAddResponse = {
	mint_contact_add: OrchardMintContactUpdate;
}

export type MintQuoteTtlUpdateResponse = {
	mint_quote_ttl_update: OrchardMintQuoteTtls;
}

export type MintNut04UpdateResponse = {
	mint_nut04_update: OrchardMintNut04Update;
}

export type MintNut05UpdateResponse = {
	mint_nut05_update: OrchardMintNut05Update;
}