/* Core Dependencies */
import {Field, ObjectType, Float} from '@nestjs/graphql';
/* Application Dependencies */
import {LightningChannelBalance, LightningCustomChannels} from '@server/modules/lightning/lightning/lightning.types';
import {oracleConvertToUSDCents} from '@server/modules/bitcoin/utxoracle/utxoracle.helpers';

@ObjectType()
export class OrchardCustomChannel {
	@Field(() => String)
	chan_id: string;

	@Field(() => String)
	asset_id: string;

	@Field(() => String)
	name: string;

	@Field(() => Float)
	local_balance: number;

	@Field(() => Float)
	remote_balance: number;

	constructor(cc: LightningCustomChannels['open_channels' | 'pending_channels'][string], chan_id: string) {
		this.chan_id = chan_id;
		this.asset_id = cc.asset_id;
		this.name = cc.name;
		this.local_balance = cc.local_balance;
		this.remote_balance = cc.remote_balance;
	}
}

@ObjectType()
export class OrchardCustomChannelData {
	@Field(() => [OrchardCustomChannel])
	open_channels: OrchardCustomChannel[];

	@Field(() => [OrchardCustomChannel])
	pending_channels: OrchardCustomChannel[];

	constructor(buffer: Buffer) {
		const ccd = this.getCustomChannelData(buffer);
		this.open_channels = ccd ? Object.entries(ccd.open_channels).map(([chan_id, cc]) => new OrchardCustomChannel(cc, chan_id)) : [];
		this.pending_channels = ccd
			? Object.entries(ccd.pending_channels).map(([chan_id, cc]) => new OrchardCustomChannel(cc, chan_id))
			: [];
	}

	private getCustomChannelData(buffer: Buffer): LightningCustomChannels | null {
		try {
			const custom_channel_data_str = buffer?.toString('utf8');
			if (!custom_channel_data_str) return null;
			if (custom_channel_data_str.trim().length === 0) return null;
			return JSON.parse(custom_channel_data_str);
		} catch {
			return null;
		}
	}
}

@ObjectType()
export class OrchardLightningBalance {
	@Field(() => Float)
	balance: number;

	@Field(() => Float)
	pending_open_balance: number;

	@Field(() => Float)
	local_balance: number;

    @Field(() => Float, {nullable: true})
	local_balance_oracle: number;

	@Field(() => Float)
	remote_balance: number;

	@Field(() => Float)
	unsettled_local_balance: number;

	@Field(() => Float)
	unsettled_remote_balance: number;

	@Field(() => Float)
	pending_open_local_balance: number;

	@Field(() => Float)
	pending_open_remote_balance: number;

	@Field(() => OrchardCustomChannelData)
	custom_channel_data: OrchardCustomChannelData;

	constructor(lnb: LightningChannelBalance, utx_oracle_price: number | null) {
		this.balance = parseFloat(lnb.balance);
		this.pending_open_balance = parseFloat(lnb.pending_open_balance);
		this.local_balance = parseFloat(lnb.local_balance);
        this.local_balance_oracle = oracleConvertToUSDCents(this.local_balance, utx_oracle_price, 'msat');
		this.remote_balance = parseFloat(lnb.remote_balance);
		this.unsettled_local_balance = parseFloat(lnb.unsettled_local_balance);
		this.unsettled_remote_balance = parseFloat(lnb.unsettled_remote_balance);
		this.pending_open_local_balance = parseFloat(lnb.pending_open_local_balance);
		this.pending_open_remote_balance = parseFloat(lnb.pending_open_remote_balance);
		this.custom_channel_data = new OrchardCustomChannelData(lnb.custom_channel_data);
	}
}
