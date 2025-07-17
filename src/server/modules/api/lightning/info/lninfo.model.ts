/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {LightningInfo} from '@server/modules/lightning/lightning/lightning.types';

@ObjectType()
export class OrchardLightningInfo {
	@Field((type) => String)
	version: string;

	@Field((type) => String)
	commit_hash: string;

	@Field((type) => String)
	identity_pubkey: string;

	@Field((type) => String)
	alias: string;

	@Field((type) => String)
	color: string;

	@Field((type) => Int)
	num_pending_channels: number;

	@Field((type) => Int)
	num_active_channels: number;

	@Field((type) => Int)
	num_inactive_channels: number;

	@Field((type) => Int)
	num_peers: number;

	@Field((type) => Int)
	block_height: number;

	@Field((type) => String)
	block_hash: string;

	@Field((type) => UnixTimestamp)
	best_header_timestamp: number;

	@Field((type) => Boolean)
	synced_to_chain: boolean;

	@Field((type) => Boolean)
	synced_to_graph: boolean;

	@Field((type) => Boolean)
	testnet: boolean;

	@Field((type) => [OrchardLightningChain])
	chains: OrchardLightningChain[];

	@Field((type) => [String])
	uris: string[];

	@Field((type) => [OrchardLightningFeature])
	features: OrchardLightningFeature[];

	@Field((type) => Boolean)
	require_htlc_interceptor: boolean;

	@Field((type) => Boolean)
	store_final_htlc_resolutions: boolean;

	constructor(ln_info: LightningInfo) {
		this.version = ln_info.version;
		this.commit_hash = ln_info.commit_hash;
		this.identity_pubkey = ln_info.identity_pubkey;
		this.alias = ln_info.alias;
		this.color = ln_info.color;
		this.num_pending_channels = ln_info.num_pending_channels;
		this.num_active_channels = ln_info.num_active_channels;
		this.num_inactive_channels = ln_info.num_inactive_channels;
		this.num_peers = ln_info.num_peers;
		this.block_height = ln_info.block_height;
		this.block_hash = ln_info.block_hash;
		this.best_header_timestamp = ln_info.best_header_timestamp;
		this.synced_to_chain = ln_info.synced_to_chain;
		this.synced_to_graph = ln_info.synced_to_graph;
		this.testnet = ln_info.testnet;
		this.chains = ln_info.chains.map((chain) => new OrchardLightningChain(chain));
		this.uris = ln_info.uris;
		this.features = Object.entries(ln_info.features).map(([bit, feature]) => new OrchardLightningFeature(feature, bit));
		this.require_htlc_interceptor = ln_info.require_htlc_interceptor;
		this.store_final_htlc_resolutions = ln_info.store_final_htlc_resolutions;
	}
}

@ObjectType()
export class OrchardLightningChain {
	@Field((type) => String)
	chain: string;

	@Field((type) => String)
	network: string;

	constructor(chain: LightningInfo['chains'][number]) {
		this.chain = chain.chain;
		this.network = chain.network;
	}
}

@ObjectType()
export class OrchardLightningFeature {
	@Field((type) => Int)
	bit: number;

	@Field((type) => String)
	name: string;

	@Field((type) => Boolean)
	is_required: boolean;

	@Field((type) => Boolean)
	is_known: boolean;

	constructor(feature: LightningInfo['features'][number], bit: string) {
		this.bit = parseInt(bit);
		this.name = feature.name;
		this.is_required = feature.is_required;
		this.is_known = feature.is_known;
	}
}
