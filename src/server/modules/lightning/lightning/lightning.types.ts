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
	chains: {chain: string; network: string}[];
	uris: string[];
	require_htlc_interceptor: boolean;
	store_final_htlc_resolutions: boolean;
	features: {[key: string]: {name: string; is_required: boolean; is_known: boolean}};
};

export type LightningChannelBalance = {
	balance: string;
	pending_open_balance: string;
	local_balance: {sat: string; msat: string};
	remote_balance: {sat: string; msat: string};
	unsettled_local_balance: {sat: string; msat: string};
	unsettled_remote_balance: {sat: string; msat: string};
	pending_open_local_balance: {sat: string; msat: string};
	pending_open_remote_balance: {sat: string; msat: string};
	custom_channel_data: Buffer;
};

export type LightningCustomChannels = {
	open_channels: {[key: string]: {asset_id: string; name: string; local_balance: number; remote_balance: number}};
	pending_channels: {[key: string]: {asset_id: string; name: string; local_balance: number; remote_balance: number}};
};
