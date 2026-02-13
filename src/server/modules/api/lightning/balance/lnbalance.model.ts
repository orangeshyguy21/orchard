/* Core Dependencies */
import {Field, ObjectType, Float} from '@nestjs/graphql';

@ObjectType()
export class OrchardLightningAssetBalance {
	@Field(() => String)
	group_key: string;

	@Field(() => String)
	asset_id: string;

	@Field(() => String)
	name: string;

	@Field(() => Float)
	capacity: number;

	@Field(() => Float)
	local_balance: number;

	@Field(() => Float)
	remote_balance: number;

	@Field(() => Float)
	decimal_display: number;
}

@ObjectType()
export class OrchardLightningChannelSummary {
	@Field(() => Float)
	capacity: number;

	@Field(() => Float)
	local_balance: number;

	@Field(() => Float)
	remote_balance: number;

	@Field(() => [OrchardLightningAssetBalance])
	assets: OrchardLightningAssetBalance[];
}

@ObjectType()
export class OrchardLightningBalance {
	@Field(() => OrchardLightningChannelSummary)
	open: OrchardLightningChannelSummary;

	@Field(() => OrchardLightningChannelSummary)
	active: OrchardLightningChannelSummary;

	@Field(() => Float)
	pending_open_balance: number;

	@Field(() => Float)
	unsettled_local_balance: number;

	@Field(() => Float)
	unsettled_remote_balance: number;

	@Field(() => Float)
	pending_open_local_balance: number;

	@Field(() => Float)
	pending_open_remote_balance: number;
}
