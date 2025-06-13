import { OrchardTaprootAssets, OrchardTaprootAsset } from "@shared/generated.types";

export class TaprootAssets implements OrchardTaprootAssets {

    public assets: OrchardTaprootAsset[];
    public unconfirmed_transfers: string;
    public unconfirmed_mints: string;

    constructor(ota: OrchardTaprootAssets) {
        this.assets = ota.assets;
        this.unconfirmed_transfers = ota.unconfirmed_transfers;
        this.unconfirmed_mints = ota.unconfirmed_mints;
    }
}