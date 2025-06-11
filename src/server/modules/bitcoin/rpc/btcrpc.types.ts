export type BitcoinInfo = {
    chain: string;
    blocks: number;
    headers: number;
    bestblockhash: string;
    difficulty: number;
    mediantime: number;
    verificationprogress: number;
    initialblockdownload: boolean;
    chainwork: string;
    size_on_disk: number;
    pruned: boolean;
    pruneheight: number;
    automatic_pruning: boolean;
    prune_target_size: number;
    warnings: string[];
    softforks: {
        [key: string]: {
            type: string;
            bip9: {
                status: string;
                bit: number;
                start_time: number;
                timeout: number;
                since: number;
                statistics: {
                    period: number;
                    threshold: number;
                    elapsed: number;
                    count: number;
                    possible: boolean;
                };
                height: number;
                active: boolean;
            };
        };
    };
}