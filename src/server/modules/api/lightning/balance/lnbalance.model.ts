/* Core Dependencies */
import { Field, ObjectType, Float } from '@nestjs/graphql';
/* Application Dependencies */
import { LightningChannelBalance } from '@server/modules/lightning/rpc/lnrpc.types';
import { Base64 } from '@server/modules/graphql/scalars/base64.scalar';

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

    @Field(type => Base64)
    custom_channel_data: string;

	constructor(lnb: LightningChannelBalance) {
        this.balance = parseFloat(lnb.balance);
        this.pending_open_balance = parseFloat(lnb.pending_open_balance);
        this.local_balance = new OrchardLightningBalanceAmount(lnb.local_balance);
        this.remote_balance = new OrchardLightningBalanceAmount(lnb.remote_balance);
        this.unsettled_local_balance = new OrchardLightningBalanceAmount(lnb.unsettled_local_balance);
        this.unsettled_remote_balance = new OrchardLightningBalanceAmount(lnb.unsettled_remote_balance);
        this.pending_open_local_balance = new OrchardLightningBalanceAmount(lnb.pending_open_local_balance);
        this.pending_open_remote_balance = new OrchardLightningBalanceAmount(lnb.pending_open_remote_balance);
        this.custom_channel_data = lnb.custom_channel_data.toString('base64');
	}
}