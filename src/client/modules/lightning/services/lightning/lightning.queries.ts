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
        open{
            capacity
            local_balance
            remote_balance
            assets{
                group_key
                asset_id
                name
                capacity
                local_balance
                remote_balance
                decimal_display
            }
        }
        active{
            capacity
            local_balance
            remote_balance
            assets{
                group_key
                asset_id
                name
                capacity
                local_balance
                remote_balance
                decimal_display
            }
        }
        pending_open_balance
        unsettled_local_balance
        unsettled_remote_balance
        pending_open_local_balance
        pending_open_remote_balance
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

export const LIGHTNING_ANALYTICS_QUERY = `
query LightningAnalytics($date_start: UnixTimestamp, $date_end: UnixTimestamp, $interval: LightningAnalyticsInterval, $timezone: Timezone, $metrics: [LightningAnalyticsMetric!]) {
	lightning_analytics(date_start: $date_start, date_end: $date_end, interval: $interval, timezone: $timezone, metrics: $metrics) {
		unit
		metric
		amount
		date
	}
}`;

export const LIGHTNING_CHANNELS_QUERY = `{
	lightning_channels{
		channel_point
		chan_id
		capacity
		local_balance
		remote_balance
		initiator
		push_amount_sat
		private
		active
		funding_txid
		asset{
			group_key
			asset_id
			name
			local_balance
			remote_balance
			capacity
			decimal_display
		}
	}
}`;

export const LIGHTNING_CLOSED_CHANNELS_QUERY = `{
	lightning_closed_channels{
		channel_point
		chan_id
		capacity
		close_height
		settled_balance
		time_locked_balance
		close_type
		open_initiator
		funding_txid
		closing_txid
		asset{
			group_key
			asset_id
			name
			local_balance
			remote_balance
			capacity
			decimal_display
		}
	}
}`;

export const LIGHTNING_ANALYTICS_BACKFILL_STATUS_QUERY = `{
	lightning_analytics_backfill_status {
		is_running
		started_at
		errors
		hours_completed
	}
}`;
