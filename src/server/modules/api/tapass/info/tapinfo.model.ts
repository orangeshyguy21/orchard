/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {TaprootAssetsInfo} from '@server/modules/tapass/tapass/tapass.types';

@ObjectType()
export class OrchardTaprootAssetsInfo {
	@Field(() => String)
	version: string;

	@Field(() => String)
	lnd_version: string;

	@Field(() => String)
	network: string;

	@Field(() => String)
	lnd_identity_pubkey: string;

	@Field(() => String)
	node_alias: string;

	@Field(() => Int)
	block_height: number;

	@Field(() => String)
	block_hash: string;

	@Field(() => Boolean)
	sync_to_chain: boolean;

	constructor(ta_info: TaprootAssetsInfo) {
		this.version = ta_info.version;
		this.lnd_version = ta_info.lnd_version;
		this.network = ta_info.network;
		this.lnd_identity_pubkey = ta_info.lnd_identity_pubkey;
		this.node_alias = ta_info.node_alias;
		this.block_height = ta_info.block_height;
		this.block_hash = ta_info.block_hash;
		this.sync_to_chain = ta_info.sync_to_chain;
	}
}
