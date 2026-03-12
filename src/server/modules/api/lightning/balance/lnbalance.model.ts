/* Core Dependencies */
import {Field, ObjectType, Float} from '@nestjs/graphql';

@ObjectType({description: 'Lightning channel asset balance information'})
export class OrchardLightningAssetBalance {
	@Field(() => String, {description: 'Taproot asset group key'})
	group_key: string;

	@Field(() => String, {description: 'Unique identifier of the asset'})
	asset_id: string;

	@Field(() => String, {description: 'Human-readable name of the asset'})
	name: string;

	@Field(() => Float, {description: 'Total channel capacity for this asset'})
	capacity: number;

	@Field(() => Float, {description: 'Local balance of the asset'})
	local_balance: number;

	@Field(() => Float, {description: 'Remote balance of the asset'})
	remote_balance: number;

	@Field(() => Float, {description: 'Number of decimal places for display'})
	decimal_display: number;
}

@ObjectType({description: 'Aggregated lightning channel balance summary'})
export class OrchardLightningChannelSummary {
	@Field(() => Float, {description: 'Total channel capacity in satoshis'})
	capacity: number;

	@Field(() => Float, {description: 'Total local balance in satoshis'})
	local_balance: number;

	@Field(() => Float, {description: 'Total remote balance in satoshis'})
	remote_balance: number;

	@Field(() => [OrchardLightningAssetBalance], {description: 'Asset balances across channels'})
	assets: OrchardLightningAssetBalance[];
}

@ObjectType({description: 'Lightning node balance overview'})
export class OrchardLightningBalance {
	@Field(() => OrchardLightningChannelSummary, {description: 'Balance summary for all open channels'})
	open: OrchardLightningChannelSummary;

	@Field(() => OrchardLightningChannelSummary, {description: 'Balance summary for active channels only'})
	active: OrchardLightningChannelSummary;

	@Field(() => Float, {description: 'Total balance in pending open channels in satoshis'})
	pending_open_balance: number;

	@Field(() => Float, {description: 'Unsettled local balance in satoshis'})
	unsettled_local_balance: number;

	@Field(() => Float, {description: 'Unsettled remote balance in satoshis'})
	unsettled_remote_balance: number;

	@Field(() => Float, {description: 'Local balance in pending open channels in satoshis'})
	pending_open_local_balance: number;

	@Field(() => Float, {description: 'Remote balance in pending open channels in satoshis'})
	pending_open_remote_balance: number;
}
