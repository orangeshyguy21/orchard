import {OrchardTaprootAssetsInfo} from '@shared/generated.types';

export class TaprootAssetInfo implements OrchardTaprootAssetsInfo {
	public block_hash: string;
	public block_height: number;
	public lnd_identity_pubkey: string;
	public lnd_version: string;
	public network: string;
	public node_alias: string;
	public sync_to_chain: boolean;
	public version: string;

	constructor(ota: OrchardTaprootAssetsInfo) {
		this.block_hash = ota.block_hash;
		this.block_height = ota.block_height;
		this.lnd_identity_pubkey = ota.lnd_identity_pubkey;
		this.lnd_version = ota.lnd_version;
		this.network = ota.network;
		this.node_alias = ota.node_alias;
		this.sync_to_chain = ota.sync_to_chain;
		this.version = ota.version;
	}
}
