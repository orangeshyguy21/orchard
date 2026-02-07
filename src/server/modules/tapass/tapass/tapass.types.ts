import {TaprootAssetVersion, TaprootAssetType} from '@server/modules/tapass/tapass.enums';

export type TaprootAssetsInfo = {
	version: string;
	lnd_version: string;
	network: string;
	lnd_identity_pubkey: string;
	node_alias: string;
	block_height: number;
	block_hash: string;
	sync_to_chain: boolean;
};

export type TaprootAssets = {
	assets: TaprootAsset[];
	unconfirmed_transfers: string;
	unconfirmed_mints: string;
};

export type TaprootAssetsUtxos = {
	managed_utxos: {
		[key: string]: {
			assets: TaprootAsset[];
			out_point: string;
			amt_sat: string;
			internal_key: Buffer;
			taproot_asset_root: Buffer;
			merkle_root: Buffer;
			lease_owner: Buffer;
			lease_expiry_unix: string;
		};
	};
};

export type TaprootAssetGroup = {
	raw_group_key: Buffer;
	tweaked_group_key: Buffer;
	asset_witness: Buffer;
	tapscript_root: Buffer;
};

export type TaprootAsset = {
	prev_witnesses: any[];
	version: TaprootAssetVersion;
	asset_genesis: {
		genesis_point: string;
		name: string;
		meta_hash: Buffer;
		asset_id: Buffer;
		asset_type: TaprootAssetType;
		output_index: number;
	};
	amount: string;
	lock_time: number;
	relative_lock_time: number;
	script_version: number;
	script_key: Buffer;
	script_key_is_local: boolean;
	asset_group: TaprootAssetGroup | null;
	chain_anchor: {
		anchor_tx: Buffer;
		anchor_block_hash: string;
		anchor_outpoint: string;
		internal_key: Buffer;
		merkle_root: Buffer;
		tapscript_sibling: Buffer;
		block_height: number;
		block_timestamp: string;
	};
	is_spent: boolean;
	lease_owner: Buffer;
	lease_expiry: string;
	is_burn: boolean;
	script_key_declared_known: boolean;
	script_key_has_script_path: boolean;
	decimal_display: {
		decimal_display: number;
	};
	script_key_type: string;
};
