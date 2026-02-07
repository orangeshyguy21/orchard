/* Native Dependencies */
import {base64ToHex} from '@client/modules/tapass/helpers/tapass.helpers';
/* Shared Dependencies */
import {
	OrchardTaprootAssets,
	OrchardTaprootAsset,
	OrchardTaprootAssetGroup,
	OrchardTaprootAssetDecimalDisplay,
	OrchardTaprootAssetGenesis,
	TaprootAssetVersion,
	TaprootAssetType,
} from '@shared/generated.types';


export class TaprootAssets implements OrchardTaprootAssets {
	public assets: TaprootAsset[];
	public unconfirmed_transfers: string;
	public unconfirmed_mints: string;

	constructor(ota: OrchardTaprootAssets) {
		this.assets = ota.assets.map((asset) => new TaprootAsset(asset));
		this.unconfirmed_transfers = ota.unconfirmed_transfers;
		this.unconfirmed_mints = ota.unconfirmed_mints;
	}
}

export class TaprootAsset implements OrchardTaprootAsset {
	public amount: string;
	public version: TaprootAssetVersion;
	public is_burn: boolean;
	public is_spent: boolean;
	public asset_group: TaprootAssetGroup | null;
	public decimal_display: OrchardTaprootAssetDecimalDisplay;
	public asset_genesis: TaprootAssetGenesis;

	constructor(ota: OrchardTaprootAsset) {
		this.amount = ota.amount;
		this.version = ota.version;
		this.is_burn = ota.is_burn;
		this.is_spent = ota.is_spent;
		this.asset_group = ota.asset_group ? new TaprootAssetGroup(ota.asset_group) : null;
		this.decimal_display = ota.decimal_display;
		this.asset_genesis = new TaprootAssetGenesis(ota.asset_genesis);
	}
}

export class TaprootAssetGroup implements OrchardTaprootAssetGroup {
	public raw_group_key: string;
	public tweaked_group_key: string;
	public asset_witness: string;
	public tapscript_root: string;

	constructor(otag: OrchardTaprootAssetGroup) {
		this.raw_group_key = base64ToHex(otag.raw_group_key);
		this.tweaked_group_key = base64ToHex(otag.tweaked_group_key);
		this.asset_witness = base64ToHex(otag.asset_witness);
		this.tapscript_root = base64ToHex(otag.tapscript_root);
	}
}

export class TaprootAssetGenesis implements OrchardTaprootAssetGenesis {
	public asset_id: string;
	public asset_type: TaprootAssetType;
	public name: string;
	public genesis_point: string;
	public output_index: number;

	constructor(otag: OrchardTaprootAssetGenesis) {
		this.asset_id = base64ToHex(otag.asset_id);
		this.asset_type = otag.asset_type;
		this.name = otag.name;
		this.genesis_point = otag.genesis_point;
		this.output_index = otag.output_index;
	}
}
