/* Core Dependencies */
import { Field, ObjectType, Float } from '@nestjs/graphql';
/* Application Dependencies */
import { LightningChannelBalance, LightningCustomChannels } from '@server/modules/lightning/lightning/lightning.types';

@ObjectType()
export class OrchardLightningBalanceAmount {

    @Field(type => Float)
    sat: number;

    @Field(type => Float)
    msat: number;

    constructor(lnba: { sat: string, msat: string }) {
        this.sat = parseFloat(lnba.sat);
        this.msat = parseFloat(lnba.msat);
    }
}

@ObjectType()
export class OrchardCustomChannel {

    @Field(type => String)
    chan_id: string;

    @Field(type => String)
    asset_id: string;

    @Field(type => String)
    name: string;

    @Field(type => Float)
    local_balance: number;

    @Field(type => Float)  
    remote_balance: number;

    constructor(cc: LightningCustomChannels['open_channels' | 'pending_channels'][string], chan_id:string) {
        this.chan_id = chan_id;
        this.asset_id = cc.asset_id;
        this.name = cc.name;
        this.local_balance = cc.local_balance;
        this.remote_balance = cc.remote_balance;
    }
}

@ObjectType()
export class OrchardCustomChannelData {

    @Field(type => [OrchardCustomChannel])
    open_channels: OrchardCustomChannel[];

    @Field(type => [OrchardCustomChannel])
    pending_channels: OrchardCustomChannel[];

    constructor(ccd: LightningCustomChannels) {    
        this.open_channels = Object.entries(ccd.open_channels).map(([chan_id, cc]) => new OrchardCustomChannel(cc, chan_id));
        this.pending_channels = Object.entries(ccd.pending_channels).map(([chan_id, cc]) => new OrchardCustomChannel(cc, chan_id));
    }
}

@ObjectType()
export class OrchardLightningBalance {

    @Field(type => Float)
    balance: number;

    @Field(type => Float)
    pending_open_balance: number;

    @Field(type => OrchardLightningBalanceAmount)
    local_balance: OrchardLightningBalanceAmount;

    @Field(type => OrchardLightningBalanceAmount)
    remote_balance: OrchardLightningBalanceAmount;

    @Field(type => OrchardLightningBalanceAmount)
    unsettled_local_balance: OrchardLightningBalanceAmount;

    @Field(type => OrchardLightningBalanceAmount)
    unsettled_remote_balance: OrchardLightningBalanceAmount;

    @Field(type => OrchardLightningBalanceAmount)
    pending_open_local_balance: OrchardLightningBalanceAmount;

    @Field(type => OrchardLightningBalanceAmount)
    pending_open_remote_balance: OrchardLightningBalanceAmount;

    @Field(type => OrchardCustomChannelData)
    custom_channel_data: OrchardCustomChannelData;

	constructor(lnb: LightningChannelBalance) {
        this.balance = parseFloat(lnb.balance);
        this.pending_open_balance = parseFloat(lnb.pending_open_balance);
        this.local_balance = new OrchardLightningBalanceAmount(lnb.local_balance);
        this.remote_balance = new OrchardLightningBalanceAmount(lnb.remote_balance);
        this.unsettled_local_balance = new OrchardLightningBalanceAmount(lnb.unsettled_local_balance);
        this.unsettled_remote_balance = new OrchardLightningBalanceAmount(lnb.unsettled_remote_balance);
        this.pending_open_local_balance = new OrchardLightningBalanceAmount(lnb.pending_open_local_balance);
        this.pending_open_remote_balance = new OrchardLightningBalanceAmount(lnb.pending_open_remote_balance);
        this.custom_channel_data = new OrchardCustomChannelData(JSON.parse(lnb.custom_channel_data.toString('utf8')));
	}
}