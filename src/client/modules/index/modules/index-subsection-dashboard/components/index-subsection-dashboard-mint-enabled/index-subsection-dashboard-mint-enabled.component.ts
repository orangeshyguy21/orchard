/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, effect, signal} from '@angular/core';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {OrchardError} from '@client/modules/error/types/error.types';

type Liabilities = {
	unit: string;
	amount: number;
};

@Component({
	selector: 'orc-index-subsection-dashboard-mint-enabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-mint-enabled.component.html',
	styleUrl: './index-subsection-dashboard-mint-enabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardMintEnabledComponent {
	public loading = input.required<boolean>();
	public loading_icon = input.required<boolean>();
	public info = input.required<MintInfo | null>();
	public keysets = input.required<MintKeyset[]>();
	public balances = input.required<MintBalance[]>();
	public icon_data = input.required<string | null>();
	public lightning_balance = input.required<LightningBalance | null>();
	public lightning_enabled = input.required<boolean>();
	public lightning_errors = input.required<OrchardError[]>();
	public lightning_loading = input.required<boolean>();
	public mobile_view = input.required<boolean>();

	public navigate = output<string>();

	public liabilities = signal<Liabilities[] | null>(null);

	constructor() {
		effect(() => {
			if (!this.loading()) return;
			this.init();
		});
	}

	private init(): void {
		this.liabilities.set(this.getLiabilities());
	}

	private getLiabilities(): Liabilities[] | null {
		const balances = this.balances();
		const keysets = this.keysets();
		if (!balances || !keysets) return null;

		const grouped_liabilities = balances.reduce(
			(acc, balance) => {
				const keyset = keysets.find((k) => k.id === balance.keyset);
				if (!keyset) return acc;
				if (!acc[keyset.unit]) {
					acc[keyset.unit] = {
						unit: keyset.unit,
						amount: 0,
					};
				}
				acc[keyset.unit].amount += balance.balance;
				return acc;
			},
			{} as Record<string, Liabilities>,
		);

		return Object.values(grouped_liabilities);
	}
}
