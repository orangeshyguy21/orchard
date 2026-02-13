/* Core Dependencies */
import {Field, ObjectType, Float, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {LightningChannel, LightningClosedChannel, LightningChannelAsset} from '@server/modules/lightning/lightning/lightning.types';
import {LightningChannelCloseType, LightningChannelOpenInitiator} from '@server/modules/lightning/lightning.enums';

@ObjectType()
export class OrchardLightningChannelAsset {
	@Field(() => String)
	group_key: string;

	@Field(() => String)
	asset_id: string;

	@Field(() => String)
	name: string;

	@Field(() => Float)
	local_balance: number;

	@Field(() => Float)
	remote_balance: number;

	@Field(() => Float)
	capacity: number;

	@Field(() => Float)
	decimal_display: number;

	constructor(asset: LightningChannelAsset) {
		this.group_key = asset.group_key;
		this.asset_id = asset.asset_id;
		this.name = asset.name;
		this.local_balance = parseFloat(asset.local_balance);
		this.remote_balance = parseFloat(asset.remote_balance);
		this.capacity = parseFloat(asset.capacity);
		this.decimal_display = asset.decimal_display;
	}
}

@ObjectType()
export class OrchardLightningChannel {
	@Field(() => String)
	channel_point: string;

	@Field(() => String)
	chan_id: string;

	@Field(() => Float)
	capacity: number;

	@Field(() => Float)
	local_balance: number;

	@Field(() => Float)
	remote_balance: number;

	@Field(() => Boolean, {nullable: true})
	initiator: boolean | null;

	@Field(() => Float, {nullable: true})
	push_amount_sat: number | null;

	@Field(() => Boolean)
	private: boolean;

	@Field(() => Boolean)
	active: boolean;

	@Field(() => String)
	funding_txid: string;

	@Field(() => OrchardLightningChannelAsset, {nullable: true})
	asset: OrchardLightningChannelAsset | null;

	constructor(channel: LightningChannel) {
		this.channel_point = channel.channel_point;
		this.chan_id = channel.chan_id;
		this.capacity = parseFloat(channel.capacity);
		this.local_balance = parseFloat(channel.local_balance);
		this.remote_balance = parseFloat(channel.remote_balance);
		this.initiator = channel.initiator;
		this.push_amount_sat = channel.push_amount_sat ? parseFloat(channel.push_amount_sat) : null;
		this.private = channel.private;
		this.active = channel.active;
		this.funding_txid = channel.funding_txid;
		this.asset = channel.asset ? new OrchardLightningChannelAsset(channel.asset) : null;
	}
}

@ObjectType()
export class OrchardLightningClosedChannel {
	@Field(() => String)
	channel_point: string;

	@Field(() => String)
	chan_id: string;

	@Field(() => Float)
	capacity: number;

	@Field(() => Int)
	close_height: number;

	@Field(() => Float)
	settled_balance: number;

	@Field(() => Float, {nullable: true})
	time_locked_balance: number | null;

	@Field(() => LightningChannelCloseType)
	close_type: LightningChannelCloseType;

	@Field(() => LightningChannelOpenInitiator)
	open_initiator: LightningChannelOpenInitiator;

	@Field(() => String)
	funding_txid: string;

	@Field(() => String)
	closing_txid: string;

	@Field(() => OrchardLightningChannelAsset, {nullable: true})
	asset: OrchardLightningChannelAsset | null;

	constructor(channel: LightningClosedChannel) {
		this.channel_point = channel.channel_point;
		this.chan_id = channel.chan_id;
		this.capacity = parseFloat(channel.capacity);
		this.close_height = channel.close_height;
		this.settled_balance = parseFloat(channel.settled_balance);
		this.time_locked_balance = channel.time_locked_balance ? parseFloat(channel.time_locked_balance) : null;
		this.close_type = channel.close_type;
		this.open_initiator = channel.open_initiator;
		this.funding_txid = channel.funding_txid;
		this.closing_txid = channel.closing_txid;
		this.asset = channel.asset ? new OrchardLightningChannelAsset(channel.asset) : null;
	}
}
