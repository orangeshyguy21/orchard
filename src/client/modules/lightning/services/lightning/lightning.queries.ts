export const LIGHTNING_INFO_QUERY = `{
    lightning_info{
        alias
        best_header_timestamp
        block_hash
        block_height
        color
        commit_hash
        identity_pubkey
        num_active_channels
        num_inactive_channels
        num_peers
        num_pending_channels
        require_htlc_interceptor
        store_final_htlc_resolutions
        synced_to_chain
        version
        synced_to_graph
        testnet
        uris
        chains{
            chain
            network
        }
        features{
            bit
            is_known
            is_required
            name
        }
    }
}`;

export const LIGHTNING_BALANCE_QUERY = `{
    lightning_balance{
        balance
        custom_channel_data{
            open_channels{
                asset_id
                chan_id
                local_balance
                name
                remote_balance
            }
            pending_channels{
                asset_id
                chan_id
                local_balance
                name
                remote_balance
            }
        }
        local_balance{
            sat
            msat
        }
        pending_open_balance
        pending_open_remote_balance{
            sat
            msat
        }
        remote_balance{
            sat
            msat
        }
        unsettled_local_balance{
            sat
            msat
        }
        unsettled_remote_balance{
            sat
            msat
        }
    }
}`;

export const LIGHTNING_WALLET_QUERY = `{
    lightning_wallet{
        name
        address_type
        derivation_path
        addresses{
            address
            balance
            public_key
        }
	}
}`;

export const LIGHTNING_REQUEST_QUERY = `
query LightningRequest($request: String!) {
    lightning_request(request: $request) {
        valid
        type
        expiry
        description
        offer_quantity_max
    }
}`;

export const LIGHTNING_ANALYTICS_OUTBOUND_QUERY = `
query LightningAnalyticsOutbound($date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: MintAnalyticsInterval, $timezone: Timezone) {
    lightning_analytics_outbound(date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone) {
        amount
        unit
        created_time
    }
}`;
