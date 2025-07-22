import {OrchardLightningBalance, OrchardLightningBalanceAmount, OrchardCustomChannelData} from '@shared/generated.types';

export class LightningBalance implements OrchardLightningBalance {
	public balance: number;
	public local_balance: OrchardLightningBalanceAmount;
	public pending_open_balance: number;
	public pending_open_local_balance: OrchardLightningBalanceAmount;
	public pending_open_remote_balance: OrchardLightningBalanceAmount;
	public remote_balance: OrchardLightningBalanceAmount;
	public unsettled_local_balance: OrchardLightningBalanceAmount;
	public unsettled_remote_balance: OrchardLightningBalanceAmount;
	public custom_channel_data: OrchardCustomChannelData;

	constructor(olb: OrchardLightningBalance) {
		this.balance = olb.balance;
		this.local_balance = olb.local_balance;
		this.pending_open_balance = olb.pending_open_balance;
		this.pending_open_local_balance = olb.pending_open_local_balance;
		this.pending_open_remote_balance = olb.pending_open_remote_balance;
		this.remote_balance = olb.remote_balance;
		this.unsettled_local_balance = olb.unsettled_local_balance;
		this.unsettled_remote_balance = olb.unsettled_remote_balance;
		this.custom_channel_data = olb.custom_channel_data;
	}
}
