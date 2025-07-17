/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {TaprootAssetsUtxos, TaprootAsset, TaprootAssets} from '@server/modules/tapass/tapass/tapass.types';
import {TaprootAssetType, TaprootAssetVersion} from '@server/modules/tapass/tapass.enums';
import {Base64} from '@server/modules/graphql/scalars/base64.scalar';

@ObjectType()
export class OrchardTaprootAssetDecimalDisplay {
	@Field((type) => Int)
	decimal_display: number;

	constructor(decimal_display: TaprootAsset['decimal_display']) {
		this.decimal_display = decimal_display.decimal_display;
	}
}

@ObjectType()
export class OrchardTaprootAssetGenesis {
	@Field((type) => String)
	genesis_point: string;

	@Field((type) => String)
	name: string;

	@Field((type) => Base64)
	asset_id: string;

	@Field((type) => TaprootAssetType)
	asset_type: TaprootAssetType;

	@Field((type) => Int)
	output_index: number;

	constructor(asset_genesis: TaprootAsset['asset_genesis']) {
		this.genesis_point = asset_genesis.genesis_point;
		this.name = asset_genesis.name;
		this.asset_id = asset_genesis.asset_id.toString('base64');
		this.asset_type = asset_genesis.asset_type;
		this.output_index = asset_genesis.output_index;
	}
}

@ObjectType()
export class OrchardTaprootAsset {
	@Field((type) => TaprootAssetVersion)
	version: TaprootAssetVersion;

	@Field((type) => String)
	amount: string;

	@Field((type) => String, {nullable: true})
	asset_group: string;

	@Field((type) => Boolean)
	is_spent: boolean;

	@Field((type) => Boolean)
	is_burn: boolean;

	@Field((type) => OrchardTaprootAssetGenesis)
	asset_genesis: OrchardTaprootAssetGenesis;

	@Field((type) => OrchardTaprootAssetDecimalDisplay)
	decimal_display: OrchardTaprootAssetDecimalDisplay;

	constructor(asset: TaprootAsset) {
		this.version = asset.version;
		this.amount = asset.amount;
		this.asset_group = asset.asset_group;
		this.is_spent = asset.is_spent;
		this.is_burn = asset.is_burn;
		this.asset_genesis = new OrchardTaprootAssetGenesis(asset.asset_genesis);
		this.decimal_display = new OrchardTaprootAssetDecimalDisplay(asset.decimal_display);
	}
}

@ObjectType()
export class OrchardTaprootAssets {
	@Field((type) => [OrchardTaprootAsset])
	assets: OrchardTaprootAsset[];

	@Field((type) => String)
	unconfirmed_transfers: string;

	@Field((type) => String)
	unconfirmed_mints: string;

	constructor(ta_assets: TaprootAssets) {
		this.assets = ta_assets.assets.map((asset) => new OrchardTaprootAsset(asset));
		this.unconfirmed_transfers = ta_assets.unconfirmed_transfers;
		this.unconfirmed_mints = ta_assets.unconfirmed_mints;
	}
}

@ObjectType()
export class OrchardTaprootAssetsUtxo {
	@Field((type) => String)
	id: string;

	@Field((type) => Float)
	amt_sat: number;

	@Field((type) => [OrchardTaprootAsset])
	assets: OrchardTaprootAsset[];

	constructor(ta_utxo: TaprootAssetsUtxos['managed_utxos'][string], key: string) {
		this.id = key;
		this.amt_sat = Number(ta_utxo.amt_sat);
		this.assets = ta_utxo.assets.map((asset) => new OrchardTaprootAsset(asset));
	}
}
