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
        chainwork
        hash
        height
        nTx
        time
        weight
        feerate_low
        feerate_high
    }
}`;

export const BITCOIN_MEMPOOL_TRANSACTIONS_QUERY = `{
    bitcoin_mempool_transactions{
        txid
        vsize
        weight
        time
        height
        descendantcount
        descendantsize
        ancestorcount
        ancestorsize
        wtxid
        fees{
            base
            modified
            ancestor
            descendant
        }
        depends
        spentby
        bip125_replaceable
        unbroadcast
    }
}`;

export const BITCOIN_TRANSACTION_FEE_ESTIMATES_QUERY = `
query BitcoinTransactionFeeEstimates($targets: [Int!]!) {
    bitcoin_transaction_fee_estimates(targets: $targets){
        target
        blocks
        errors
        feerate
    }
}`;

export const BITCOIN_BLOCK_TEMPLATE_QUERY = `{
    bitcoin_block_template{
        height
        weight
        nTx
        feerate_low
        feerate_high
    }
}`;
