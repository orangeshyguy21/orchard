import { OrchardTaprootAssetsInfo, OrchardTaprootAssets } from "@shared/generated.types";

export type TaprootAssetInfoResponse = {
    taproot_assets_info: OrchardTaprootAssetsInfo;
}

export type TaprootAssetResponse = {
    taproot_assets: OrchardTaprootAssets;
}