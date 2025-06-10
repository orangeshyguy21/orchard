export type LightningInfo = {
    version: string;
    commit_hash: string;
    identity_pubkey: string;
    alias: string;
    color: string;
    num_pending_channels: number;
    num_active_channels: number;
    num_inactive_channels: number;
    num_peers: number;
    block_height: number;
    block_hash: string;
    best_header_timestamp: number;
    synced_to_chain: boolean;
    synced_to_graph: boolean;
    testnet: boolean;
    chains: string[];
    uris: string[];
    require_htlc_interceptor: boolean;
    store_final_htlc_resolutions: boolean;
}