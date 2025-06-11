export const BITCOIN_INFO_QUERY = `{
    bitcoin_info{
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
