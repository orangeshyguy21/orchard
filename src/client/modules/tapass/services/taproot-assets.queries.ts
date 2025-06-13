export const TAP_INFO_QUERY = `{
    taproot_assets_info{
        block_hash
        block_height
        lnd_identity_pubkey
        lnd_version
        network
        node_alias
        sync_to_chain
        version
    }
}`

export const TAP_ASSETS_QUERY = `{
    taproot_assets{
        assets{
            amount
            version
            asset_genesis{
                asset_id
            }
        }
    }
}`