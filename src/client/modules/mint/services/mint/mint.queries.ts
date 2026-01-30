export const MINT_INFO_QUERY = `{
    mint_info{
        name
        pubkey
        version
        description
        description_long
        icon_url
        urls
        time
		contact{
			method
			info
        }
        nuts{
			nut4{
				disabled
				methods{
					method
					unit
					description
					min_amount
					max_amount
				}
			}
			nut5{
				disabled
				methods{
					method
					unit
					amountless
					min_amount
					max_amount
				}
			}
			nut7{
				supported
			}
			nut8{
				supported
			}
			nut9{
				supported
			}
			nut10{
				supported
			}
			nut11{
				supported
			}
			nut12{
				supported
			}
			nut14{
				supported
			}
			nut15{
				methods{
					method
					unit
				}
			}
			nut17{
				supported{
					method
					unit
					commands
				}
			}
			nut19{
				cached_endpoints{
					method
					path
				}
				ttl
			}
			nut20{
				supported
			}
        }
  	}
}`;

export const MINT_INFO_RPC_QUERY = `{
	mint_info_rpc{
		name
		description
		description_long
		icon_url
		motd
		total_issued
		total_redeemed
		urls
		version
		contact{
			info
			method
		}
	}
}`;

export const MINT_QUOTE_TTLS_QUERY = `{
	mint_quote_ttl{
		melt_ttl
		mint_ttl
	}
}`;

export const MINT_BALANCES_QUERY = `
query MintBalances($keyset_id: String) {
    mint_balances(keyset_id: $keyset_id) {
        balance
    	keyset
    }
}`;

export const MINT_KEYSETS_QUERY = `{
    mint_keysets{
        active
		derivation_path
		derivation_path_index
		id
		input_fee_ppk
		unit
		valid_from
		valid_to
		fees_paid
    }
}`;

export const MINT_ANALYTICS_BALANCES_QUERY = `
query MintAnalyticsBalances($units: [MintUnit!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_balances(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		unit
		amount
		created_time
		operation_count
	}
}`;

export const MINT_ANALYTICS_MINTS_QUERY = `
query MintAnalyticsMints($units: [MintUnit!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_mints(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		unit
		amount
		created_time
		operation_count
	}
}`;

export const MINT_ANALYTICS_MELTS_QUERY = `
query MintAnalyticsMelts($units: [MintUnit!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_melts(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		unit
		amount
		created_time
		operation_count
	}
}`;

export const MINT_ANALYTICS_SWAPS_QUERY = `
query MintAnalyticsSwaps($units: [MintUnit!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_swaps(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		unit
		amount
		created_time
		operation_count
	}
}`;

export const MINT_ANALYTICS_FEES_QUERY = `
query MintAnalyticsFees($units: [MintUnit!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_fees(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		unit
		amount
		created_time
		operation_count
	}
}`;

export const MINT_MINT_QUOTES_QUERY = `
query MintMintQuotes($units: [MintUnit!], $states: [MintQuoteState!], $date_start: UnixTimestamp, $date_end: UnixTimestamp) {
	mint_mint_quotes(units: $units, states: $states, date_start: $date_start, date_end: $date_end) {
		id
		amount
		amount_issued
		unit
		state
		issued_time
		created_time
		payment_method
	}
}`;

export const MINT_MELT_QUOTES_QUERY = `
query MintMeltQuotes($units: [MintUnit!], $states: [MeltQuoteState!], $date_start: UnixTimestamp, $date_end: UnixTimestamp) {
	mint_melt_quotes(units: $units, states: $states, date_start: $date_start, date_end: $date_end) {
		id
		amount
		unit
		state
		created_time
		paid_time
		payment_method
	}
}`;

export const MINT_ANALYTICS_KEYSETS_QUERY = `
query MintAnalyticsKeysets($date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_keysets(date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		amount
		created_time
		keyset_id
	}
}`;

export const MINT_KEYSET_PROOF_COUNTS_QUERY = `
query MintKeysetProofCounts($date_start: UnixTimestamp, $date_end: UnixTimestamp, $id_keysets: [String!]) {
	mint_keyset_proof_counts(date_start: $date_start, date_end: $date_end, id_keysets: $id_keysets) {
		id
		count
	}
}`;

export const MINT_NAME_MUTATION = `
mutation MintName($mint_name_update: MintNameUpdateInput!) {
	mint_name_update(mint_name_update: $mint_name_update) {
		name
	}
}`;

export const MINT_DESCRIPTION_MUTATION = `
mutation MintDescription($mint_desc_update: MintDescriptionUpdateInput!) {
	mint_short_description_update(mint_desc_update: $mint_desc_update) {
		description
	}
}`;

export const MINT_DESCRIPTION_LONG_MUTATION = `
mutation MintDescriptionLong($mint_desc_update: MintDescriptionUpdateInput!) {
	mint_long_description_update(mint_desc_update: $mint_desc_update) {
		description
	}
}`;

export const MINT_ICON_MUTATION = `
mutation MintIcon($mint_icon_update: MintIconUpdateInput!) {
	mint_icon_update(mint_icon_update: $mint_icon_update) {
		icon_url
	}
}`;

export const MINT_MOTD_MUTATION = `
mutation MintMotd($mint_motd_update: MintMotdUpdateInput!) {
	mint_motd_update(mint_motd_update: $mint_motd_update) {
		motd
	}
}`;

export const MINT_URL_UPDATE_MUTATIONS = `
mutation MintUrlUpdate($url_add: MintUrlUpdateInput!, $url_remove: MintUrlUpdateInput!) {
	mint_url_add(mint_url_update: $url_add) {
		url
	}
	mint_url_remove(mint_url_update: $url_remove) {
		url
	}
}`;

export const MINT_URL_ADD_MUTATION = `
mutation MintUrlAdd($mint_url_update: MintUrlUpdateInput!) {
	mint_url_add(mint_url_update: $mint_url_update) {
		url
	}
}`;

export const MINT_URL_REMOVE_MUTATION = `
mutation MintUrlRemove($mint_url_update: MintUrlUpdateInput!) {
	mint_url_remove(mint_url_update: $mint_url_update) {
		url
	}
}`;

export const MINT_CONTACT_REMOVE_MUTATION = `
mutation MintContactRemove($contact_remove: MintContactUpdateInput!) {
	mint_contact_remove(mint_contact_update: $contact_remove) {
		method
		info
	}
}`;

export const MINT_CONTACT_ADD_MUTATION = `
mutation MintContactAdd($contact_add: MintContactUpdateInput!) {
	mint_contact_add(mint_contact_update: $contact_add) {
		method
		info
	}
}`;

export const MINT_QUOTE_TTL_MUTATION = `
mutation MintQuoteTtl($mint_quote_ttl_update: MintQuoteTtlUpdateInput!) {
	mint_quote_ttl_update(mint_quote_ttl_update: $mint_quote_ttl_update) {
		mint_ttl
		melt_ttl
	}
}`;

export const MINT_NUT04_UPDATE_MUTATION = `
mutation MintNut04Update($mint_nut04_update: MintNut04UpdateInput!) {
	mint_nut04_update(mint_nut04_update: $mint_nut04_update) {
		unit
		method
		max_amount
		min_amount
		description
		disabled
	}
}`;

export const MINT_NUT05_UPDATE_MUTATION = `
mutation MintNut05Update($mint_nut05_update: MintNut05UpdateInput!) {
	mint_nut05_update(mint_nut05_update: $mint_nut05_update) {
		unit
		method
		max_amount
		min_amount
		disabled
	}
}`;

export const MINT_KEYSETS_ROTATION_MUTATION = `
mutation MintRotateKeyset($mint_rotate_keyset: MintRotateKeysetInput!) {
	mint_rotate_keyset(mint_rotate_keyset: $mint_rotate_keyset) {
		unit
		input_fee_ppk
		max_order
	}
}`;

export const MINT_MINT_QUOTES_DATA_QUERY = `
query MintMintQuotes($units: [MintUnit!], $states: [MintQuoteState!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $page: Int, $page_size: Int) {
	mint_mint_quotes(units: $units, states: $states, date_start: $date_start, date_end: $date_end, page: $page, page_size: $page_size) {
		id
		amount
		unit
		request
		state
		request_lookup_id
		pubkey
		issued_time
		created_time
		paid_time
		amount_paid
		amount_issued
		payment_method
	}
	mint_count_mint_quotes(units: $units, states: $states, date_start: $date_start, date_end: $date_end) {
		count
	}
}`;

export const MINT_MELT_QUOTES_DATA_QUERY = `
query MintMeltQuotes($units: [MintUnit!], $states: [MeltQuoteState!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $page: Int, $page_size: Int) {
	mint_melt_quotes(units: $units, states: $states, date_start: $date_start, date_end: $date_end, page: $page, page_size: $page_size) {
		id
		amount
		unit
		request
		fee_reserve
		state
		payment_preimage
		request_lookup_id
		msat_to_pay
		created_time
		paid_time
		payment_method
	}
	mint_count_melt_quotes(units: $units, states: $states, date_start: $date_start, date_end: $date_end) {
		count
	}
}`;

export const MINT_PROOF_GROUPS_DATA_QUERY = `
query MintProofGroups($units: [MintUnit!], $id_keysets: [String!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $states: [MintProofState!], $page: Int, $page_size: Int) {
	mint_proof_groups(units: $units, id_keysets: $id_keysets, date_start: $date_start, date_end: $date_end, states: $states, page: $page, page_size: $page_size) {
		amount
		created_time
		keyset_ids
		state
		unit
		amounts
	}
	mint_count_proof_groups(units: $units, id_keysets: $id_keysets, date_start: $date_start, date_end: $date_end, states: $states) {
		count
	}
}`;

export const MINT_PROMISE_GROUPS_DATA_QUERY = `
query MintPromiseGroups($units: [MintUnit!], $id_keysets: [String!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $page: Int, $page_size: Int) {
	mint_promise_groups(units: $units, id_keysets: $id_keysets, date_start: $date_start, date_end: $date_end, page: $page, page_size: $page_size) {
		amount
		created_time
		keyset_ids
		unit
		amounts
	}
	mint_count_promise_groups(units: $units, id_keysets: $id_keysets, date_start: $date_start, date_end: $date_end) {
		count
	}
}`;

export const MINT_DATABASE_BACKUP_MUTATION = `
mutation MintDatabaseBackup {
	mint_database_backup {
		filebase64
	}
}`;

export const MINT_DATABASE_RESTORE_MUTATION = `
mutation MintDatabaseRestore($filebase64: Base64!) {
	mint_database_restore(filebase64: $filebase64) {
		success
	}
}`;

export const MINT_PROOF_GROUP_STATS_QUERY = `
query MintProofGroupStats($unit: MintUnit!) {
	mint_proof_group_stats(unit: $unit) {
		median
	}
}`;

export const MINT_FEES_QUERY = `
query MintFees($limit: Int) {
	mint_fees(limit: $limit) {
		unit
		keyset_balance
		keyset_fees_paid
		backend_balance
		time
	}
}`;

export const MINT_NUT04_QUOTE_UPDATE_MUTATION = `
mutation MintNut04QuoteUpdate($mint_nut04_quote_update: MintNut04QuoteUpdateInput!) {
	mint_nut04_quote_update(mint_nut04_quote_update: $mint_nut04_quote_update) {
		quote_id
		state
	}
}`;

export const MINT_NUT05_QUOTE_UPDATE_MUTATION = `
mutation MintNut05QuoteUpdate($mint_nut05_quote_update: MintNut05QuoteUpdateInput!) {
	mint_nut05_quote_update(mint_nut05_quote_update: $mint_nut05_quote_update) {
		quote_id
		state
	}
}`;
