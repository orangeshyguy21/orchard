/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {LightningInfo} from '@server/modules/lightning/lightning/lightning.types';

@ObjectType()
export class OrchardLightningInfo {
	@Field(() => String)
	version: string;

	@Field(() => String)
	commit_hash: string;

	@Field(() => String)
	identity_pubkey: string;

	@Field(() => String)
	alias: string;

	@Field(() => String)
	color: string;

	@Field(() => Int)
	num_pending_channels: number;

	@Field(() => Int)
	num_active_channels: number;

	@Field(() => Int)
	num_inactive_channels: number;

	@Field(() => Int)
	num_peers: number;

	@Field(() => Int)
	block_height: number;

	@Field(() => String)
	block_hash: string;

	@Field(() => UnixTimestamp)
	best_header_timestamp: number;

	@Field(() => Boolean)
	synced_to_chain: boolean;

	@Field(() => Boolean)
	synced_to_graph: boolean;

	@Field(() => Boolean)
	testnet: boolean;

	@Field(() => [OrchardLightningChain])
	chains: OrchardLightningChain[];

	@Field(() => [String])
	uris: string[];

	@Field(() => [OrchardLightningFeature])
	features: OrchardLightningFeature[];

	@Field(() => Boolean)
	require_htlc_interceptor: boolean;

	@Field(() => Boolean)
	store_final_htlc_resolutions: boolean;

	constructor(ln_info: LightningInfo) {
		this.version = ln_info.version;
		this.commit_hash = ln_info.commit_hash;
		this.identity_pubkey = ln_info.identity_pubkey;
		this.alias = ln_info.alias;
		this.color = ln_info.color?.startsWith('#') ? ln_info.color : `#${ln_info.color}`;
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
	@Field(() => String)
	chain: string;

	@Field(() => String)
	network: string;

	constructor(chain: LightningInfo['chains'][number]) {
		this.chain = chain.chain;
		this.network = chain.network;
	}
}

@ObjectType()
export class OrchardLightningFeature {
	@Field(() => Int)
	bit: number;

	@Field(() => String)
	name: string;

	@Field(() => Boolean)
	is_required: boolean;

	@Field(() => Boolean)
	is_known: boolean;

	constructor(feature: LightningInfo['features'][number], bit: string) {
		this.bit = parseInt(bit);
		this.name = feature.name;
		this.is_required = feature.is_required;
		this.is_known = feature.is_known;
	}
}
