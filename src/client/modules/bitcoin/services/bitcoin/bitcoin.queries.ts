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
        size
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
        size
        weight
        nTx
        feerate_low
        feerate_high
    }
}`;

export const BITCOIN_ORACLE_PRICE_QUERY = `
query BitcoinOraclePrice($start_date: UnixTimestamp, $end_date: UnixTimestamp) {
    bitcoin_oracle(start_date: $start_date, end_date: $end_date){
        date
        price
    }
}`;

export const BITCOIN_ORACLE_BACKFILL_SUBSCRIPTION = `
    subscription BitcoinOracleBackfill($id: String!, $auth: String!, $start_date: UnixTimestamp!, $end_date: UnixTimestamp) {
        bitcoin_oracle_backfill(id: $id, auth: $auth, start_date: $start_date, end_date: $end_date) {
            id
            status
            start_date
            end_date
            total_days
            processed
            successful
            failed
            date
            price
            success
            error
            date_progress
            overall_progress
            message
        }
    }
`;

export const BITCOIN_ORACLE_BACKFILL_ABORT_MUTATION = `
mutation BitcoinOracleBackfillAbort($id: String!) {
    bitcoin_oracle_backfill_abort(id: $id) {
        id
    }
}`;
