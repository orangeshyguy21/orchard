/* Shared Dependencies */
import {
	OrchardLightningChannel,
	OrchardLightningClosedChannel,
	OrchardLightningChannelAsset,
	LightningChannelCloseType,
	LightningChannelOpenInitiator,
} from '@shared/generated.types';

export class LightningChannelAsset implements OrchardLightningChannelAsset {
	public group_key: string;
	public asset_id: string;
	public name: string;
	public local_balance: number;
	public remote_balance: number;
	public capacity: number;
	public decimal_display: number;

	constructor(olca: OrchardLightningChannelAsset) {
		this.group_key = olca.group_key;
		this.asset_id = olca.asset_id;
		this.name = olca.name;
		this.local_balance = olca.local_balance;
		this.remote_balance = olca.remote_balance;
		this.capacity = olca.capacity;
		this.decimal_display = olca.decimal_display;
	}
}

export class LightningChannel implements OrchardLightningChannel {
	public channel_point: string;
	public chan_id: string;
	public capacity: number;
	public local_balance: number;
	public remote_balance: number;
	public initiator: boolean | null;
	public push_amount_sat: number | null;
	public private: boolean;
	public active: boolean;
	public funding_txid: string;
	public asset: LightningChannelAsset | null;

	constructor(olc: OrchardLightningChannel) {
		this.channel_point = olc.channel_point;
		this.chan_id = olc.chan_id;
		this.capacity = olc.capacity;
		this.local_balance = olc.local_balance;
		this.remote_balance = olc.remote_balance;
		this.initiator = olc.initiator ?? null;
		this.push_amount_sat = olc.push_amount_sat ?? null;
		this.private = olc.private;
		this.active = olc.active;
		this.funding_txid = olc.funding_txid;
		this.asset = olc.asset ? new LightningChannelAsset(olc.asset) : null;
	}
}

export class LightningClosedChannel implements OrchardLightningClosedChannel {
	public channel_point: string;
	public chan_id: string;
	public capacity: number;
	public close_height: number;
	public settled_balance: number;
	public time_locked_balance: number | null;
	public close_type: LightningChannelCloseType;
	public open_initiator: LightningChannelOpenInitiator;
	public funding_txid: string;
	public closing_txid: string;
	public asset: LightningChannelAsset | null;

	constructor(olcc: OrchardLightningClosedChannel) {
		this.channel_point = olcc.channel_point;
		this.chan_id = olcc.chan_id;
		this.capacity = olcc.capacity;
		this.close_height = olcc.close_height;
		this.settled_balance = olcc.settled_balance;
		this.time_locked_balance = olcc.time_locked_balance ?? null;
		this.close_type = olcc.close_type;
		this.open_initiator = olcc.open_initiator;
		this.funding_txid = olcc.funding_txid;
		this.closing_txid = olcc.closing_txid;
		this.asset = olcc.asset ? new LightningChannelAsset(olcc.asset) : null;
	}
}
