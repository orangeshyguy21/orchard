export type BitcoinBlockchainInfo = {
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

export type BitcoinNetworkInfo = {
    version: number;
    subversion: string;
    protocolversion: number;
    localservices: string;
    localservicesnames: string[];
    localrelay: boolean;
    timeoffset: number;
    connections: number;
    connections_in: number;
    connections_out: number;
    networkactive: boolean;
    networks: {
        name: string;
        limited: boolean;
        reachable: boolean;
        proxy: string;
        proxy_randomize_credentials: boolean;
    }[];
    relayfee: number;
    incrementalfee: number;
    localaddresses: {
        address: string;
        port: number;
        score: number;
    }[];
    warnings: string[];
}