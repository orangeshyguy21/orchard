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

export const MINT_BALANCES_QUERY = `{
    mint_balances{
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
    }
}`;

export const MINT_PROMISES_QUERY = `
query MintPromises($id_keysets: [String!]) {
	mint_promises(id_keysets: $id_keysets) {
		amount
		id
		b_
		c_
		dleq_e
		dleq_s
		created
		mint_quote
		swap_id
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

export const MINT_ANALYTICS_TRANSFERS_QUERY = `
query MintAnalyticsTransfers($units: [MintUnit!], $date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
	mint_analytics_transfers(units: $units, date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
		unit
		amount
		created_time
		operation_count
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

export const MINT_ICON_MUTATION = `
mutation MintIcon($mint_icon_update: MintIconUpdateInput!) {
	mint_icon_update(mint_icon_update: $mint_icon_update) {
		icon_url
	}
}`;
