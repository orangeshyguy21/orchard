export const BITCOIN_BLOCKCHAIN_INFO_QUERY = `{
    bitcoin_blockchain_info{
        chain
        blocks
        headers
        bestblockhash
        difficulty
        verificationprogress
        initialblockdownload
        chainwork
        size_on_disk
        pruned
        pruneheight
        automatic_pruning
        prune_target_size
        warnings
    }
}`;

export const BITCOIN_BLOCK_COUNT_QUERY = `{
    bitcoin_blockcount{
        height
    }
}`;

export const BITCOIN_NETWORK_INFO_QUERY = `{
    bitcoin_network_info{
        connections
        connections_in
        connections_out
        incrementalfee
        localaddresses{
            address
            port
            score
        }
        localrelay
        localservices
        localservicesnames
        networkactive
        networks{
            name
            limited
            reachable
            proxy
            proxy_randomize_credentials
        }
        protocolversion
        relayfee
        subversion
        timeoffset
        version
        warnings
    }
}`;

export const BITCOIN_BLOCK_QUERY = `
query BitcoinBlock($hash: String!) {
    bitcoin_block(hash: $hash){
        bits
        chainwork
        confirmations
        difficulty
        hash
        height
        mediantime
        merkleroot
        nTx
        nextblockhash
        nonce
        previousblockhash
        size
        strippedsize
        time
        version
        versionHex
        weight
        tx
    }
}`;