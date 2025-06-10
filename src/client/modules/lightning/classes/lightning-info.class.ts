import { OrchardLightningInfo, OrchardLightningChain, OrchardLightningFeature } from "@shared/generated.types";

export class LightningInfo implements OrchardLightningInfo {

    public alias: string;
    public best_header_timestamp: number;
    public block_hash: string;
    public block_height: number;
    public chains: OrchardLightningChain[];
    public color: string;
    public commit_hash: string;
    public features: OrchardLightningFeature[];
    public identity_pubkey: string;
    public num_active_channels: number;
    public num_inactive_channels: number;
    public num_peers: number;
    public num_pending_channels: number;
    public require_htlc_interceptor: boolean;
    public store_final_htlc_resolutions: boolean;
    public synced_to_chain: boolean;
    public synced_to_graph: boolean;
    public testnet: boolean;
    public uris: string[];
    public version: string;

	constructor(oli: OrchardLightningInfo) {
		this.alias = oli.alias;
		this.best_header_timestamp = oli.best_header_timestamp;
		this.block_hash = oli.block_hash;
		this.block_height = oli.block_height;
		this.chains = oli.chains;
		this.color = oli.color;
		this.commit_hash = oli.commit_hash;
		this.features = oli.features;
		this.identity_pubkey = oli.identity_pubkey;
		this.num_active_channels = oli.num_active_channels;
		this.num_inactive_channels = oli.num_inactive_channels;
		this.num_peers = oli.num_peers;
		this.num_pending_channels = oli.num_pending_channels;
		this.require_htlc_interceptor = oli.require_htlc_interceptor;
		this.store_final_htlc_resolutions = oli.store_final_htlc_resolutions;
		this.synced_to_chain = oli.synced_to_chain;
		this.synced_to_graph = oli.synced_to_graph;
		this.testnet = oli.testnet;
		this.uris = oli.uris;
		this.version = oli.version;
	}
}