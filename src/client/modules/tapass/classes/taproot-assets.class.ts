import { 
    OrchardTaprootAssets,
    OrchardTaprootAsset,
    OrchardTaprootAssetDecimalDisplay,
    OrchardTaprootAssetGenesis,
    TaprootAssetVersion,
    TaprootAssetType
} from "@shared/generated.types";

export class TaprootAssets implements OrchardTaprootAssets {

    public assets: TaprootAsset[];
    public unconfirmed_transfers: string;
    public unconfirmed_mints: string;

    constructor(ota: OrchardTaprootAssets) {
        this.assets = ota.assets.map(asset => new TaprootAsset(asset));
        this.unconfirmed_transfers = ota.unconfirmed_transfers;
        this.unconfirmed_mints = ota.unconfirmed_mints;
    }
}

export class TaprootAsset implements OrchardTaprootAsset {

    public amount: string;
    public version: TaprootAssetVersion;
    public is_burn: boolean;
    public is_spent: boolean;
    public decimal_display: OrchardTaprootAssetDecimalDisplay;
    public asset_genesis: OrchardTaprootAssetGenesis;

    constructor(ota: OrchardTaprootAsset) {
        this.amount = ota.amount;
        this.version = ota.version;
        this.is_burn = ota.is_burn;
        this.is_spent = ota.is_spent;
        this.decimal_display = ota.decimal_display;
        this.asset_genesis = new TaprootAssetGenesis(ota.asset_genesis);
    }
}

export class TaprootAssetGenesis implements OrchardTaprootAssetGenesis {

    public asset_id: string;
    public asset_type: TaprootAssetType;
    public name: string;
    public genesis_point: string;
    public output_index: number;

    constructor(otag: OrchardTaprootAssetGenesis) {
        this.asset_id = Array.from(atob(otag.asset_id))
            .map(byte => byte.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
        this.asset_type = otag.asset_type;
        this.name = otag.name;
        this.genesis_point = otag.genesis_point;
        this.output_index = otag.output_index;
    }
}