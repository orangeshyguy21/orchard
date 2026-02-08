import {OrchardLightningBalance, OrchardLightningChannelSummary, OrchardLightningAssetBalance} from '@shared/generated.types';

export class LightningAssetBalance implements OrchardLightningAssetBalance {
	public group_key: string;
	public asset_id: string;
	public name: string;
	public capacity: number;
	public local_balance: number;
	public remote_balance: number;
	public decimal_display: number;

	constructor(olab: OrchardLightningAssetBalance) {
		this.group_key = olab.group_key;
		this.asset_id = olab.asset_id;
		this.name = olab.name;
		this.capacity = olab.capacity;
		this.local_balance = olab.local_balance;
		this.remote_balance = olab.remote_balance;
		this.decimal_display = olab.decimal_display;
	}
}

export class LightningChannelSummary implements OrchardLightningChannelSummary {
	public capacity: number;
	public local_balance: number;
	public remote_balance: number;
	public assets: LightningAssetBalance[];

	constructor(olcs: OrchardLightningChannelSummary) {
		this.capacity = olcs.capacity;
		this.local_balance = olcs.local_balance;
		this.remote_balance = olcs.remote_balance;
		this.assets = olcs.assets.map((a) => new LightningAssetBalance(a));
	}
}

export class LightningBalance implements OrchardLightningBalance {
	public open: LightningChannelSummary;
	public active: LightningChannelSummary;
	public pending_open_balance: number;
	public unsettled_local_balance: number;
	public unsettled_remote_balance: number;
	public pending_open_local_balance: number;
	public pending_open_remote_balance: number;

	constructor(olb: OrchardLightningBalance) {
		this.open = new LightningChannelSummary(olb.open);
		this.active = new LightningChannelSummary(olb.active);
		this.pending_open_balance = olb.pending_open_balance;
		this.unsettled_local_balance = olb.unsettled_local_balance;
		this.unsettled_remote_balance = olb.unsettled_remote_balance;
		this.pending_open_local_balance = olb.pending_open_local_balance;
		this.pending_open_remote_balance = olb.pending_open_remote_balance;
	}
}
