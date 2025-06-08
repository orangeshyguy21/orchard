import { 
    OrchardMintBalance,
    OrchardMintInfo,
    OrchardMintQuoteTtls,
    OrchardMintKeyset,
    OrchardMintPromise,
    OrchardMintAnalytics,
    OrchardMintMintQuote,
    OrchardMintMeltQuote,
    OrchardMintProofGroup,
    OrchardMintKeysetsAnalytics,
    MintUnit,
    MintAnalyticsInterval,
    MintQuoteState,
    MeltQuoteState,
    MintProofState,
    OrchardMintInfoRpc,
    OrchardMintCount,
    OrchardMintNameUpdate, 
    OrchardMintIconUpdate,
    OrchardMintDescriptionUpdate,
    OrchardMintMotdUpdate,
    OrchardMintUrlUpdate,
    OrchardMintContactUpdate,
    OrchardMintNut04Update,
    OrchardMintNut05Update,
    OrchardMintKeysetRotation,
    OrchardMintDatabaseBackup,
    OrchardMintDatabaseRestore,
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

export type MintAnalyticsKeysetsResponse = {
	mint_analytics_keysets: OrchardMintKeysetsAnalytics[];
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
    states?: MintQuoteState[];
    page?: number;
    page_size?: number;
}

export type MintMeltQuotesArgs = {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    states?: MeltQuoteState[];
    page?: number;
    page_size?: number;
}

export type MintProofGroupsArgs = {
    id_keysets?: string[];
    date_end?: number;
    states?: MintProofState[];
    page?: number;
    page_size?: number;
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

export type MintKeysetRotationResponse = {
	mint_keysets_rotation: OrchardMintKeysetRotation;
}

export type MintMintQuotesDataResponse = {
	mint_mint_quotes: OrchardMintMintQuote[];
	mint_count_mint_quotes: OrchardMintCount;
}

export type MintMeltQuotesDataResponse = {
	mint_melt_quotes: OrchardMintMeltQuote[];
	mint_count_melt_quotes: OrchardMintCount;
}

export type MintProofGroupsDataResponse = {
	mint_proof_groups: OrchardMintProofGroup[];
	mint_count_proof_groups: OrchardMintCount;
}

export type MintDatabaseBackupResponse = {
	mint_database_backup: OrchardMintDatabaseBackup;
}

export type MintDatabaseRestoreResponse = {
	mint_database_restore: OrchardMintDatabaseRestore;
}