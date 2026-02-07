/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal, OnInit} from '@angular/core';
/* Application Dependencies */
import {LightningAccount} from '@client/modules/lightning/classes/lightning-account.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import {OrchardError} from '@client/modules/error/types/error.types';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {oracleConvertToUSDCents} from '@client/modules/bitcoin/helpers/oracle.helpers';

type TableRow = {
	unit: string;
	amount: number;
    amount_oracle: number | null;
	decimal_display: number;
	utxos: number;
	group_key?: string;
    error_lightning?: boolean;
    error_taproot_assets?: boolean;
    is_bitcoin: boolean;
};

@Component({
  selector: 'orc-bitcoin-general-wallet-summary',
  standalone: false,
  templateUrl: './bitcoin-general-wallet-summary.component.html',
  styleUrl: './bitcoin-general-wallet-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinGeneralWalletSummaryComponent implements OnInit {
    public enabled_lightning = input.required<boolean>();
	public enabled_taproot_assets = input.required<boolean>();
	public enabled_oracle = input.required<boolean>();
	public bitcoin_oracle_price = input.required<BitcoinOraclePrice | null>();
	public errors_lightning = input.required<OrchardError[]>();
	public errors_taproot_assets = input.required<OrchardError[]>();
	public lightning_accounts = input.required<LightningAccount[]>();
	public taproot_assets = input.required<TaprootAssets>();

	public rows = signal<TableRow[]>([]);
    public expanded = signal<Record<string, boolean>>({});

	constructor() {}

	ngOnInit(): void {
		this.init();
	}

	private init(): void {
		const data: TableRow[] = [];
		const hot_coins = this.getHotBalanceBitcoin();
		const hot_coins_taproot_assets = this.getHotBalancesTaprootAssets();
		if (hot_coins) data.push(hot_coins);
		if (hot_coins_taproot_assets.length > 0) data.push(...hot_coins_taproot_assets);
		this.rows.set(data);
	}

	private getHotBalanceBitcoin(): TableRow | null {
		if (!this.enabled_lightning()) return null;
        const amount = this.getLightningWalletBalance();
        const amount_oracle = this.getLightningWalletBalanceOracle(amount);
		return {
			unit: 'sat',
			amount: amount,
            amount_oracle: amount_oracle,
			decimal_display: 0,
			utxos: this.getLightningWalletUtxos(),
            error_lightning: this.errors_lightning().length > 0,
            is_bitcoin: true,
		};
	}

	private getHotBalancesTaprootAssets(): TableRow[] {
		if (!this.enabled_taproot_assets()) return [];
		return this.getTaprootAssetsWalletBalance();
	}

	private getLightningWalletBalance(): number {
		if (!this.enabled_lightning()) return 0;
		if (this.errors_lightning().length > 0) return 0;
		return this.lightning_accounts().flatMap((account) => account.addresses).reduce((sum, address) => sum + address.balance, 0);
	}

    private getLightningWalletBalanceOracle(amount: number): number | null {
        if (!this.enabled_oracle()) return null;
        const oracle_price = this.bitcoin_oracle_price()?.price || null;
        return oracle_price ? oracleConvertToUSDCents(amount, oracle_price, 'sat') : null;
    }

	private getLightningWalletUtxos(): number {
		if (!this.enabled_lightning()) return 0;
		if (this.errors_lightning().length > 0) return 0;
		const unique_addresses = new Set(this.lightning_accounts()
            .flatMap((account) => account.addresses)
            .filter((address) => address.balance > 0)
            .map((address) => address.address));
		return unique_addresses.size;
	}

	private getTaprootAssetsWalletBalance(): TableRow[] {
		if (!this.enabled_taproot_assets()) return [];
		console.log('getTaprootAssetsWalletBalance', this.taproot_assets());
		const grouped_assets = this.taproot_assets().assets.reduce(
			(acc, asset) => {
				const asset_key = asset.asset_group?.tweaked_group_key || asset.asset_genesis.asset_id;
				const amount = parseInt(asset.amount) / Math.pow(10, asset.decimal_display?.decimal_display || 0);
				if (!acc[asset_key]) {
					acc[asset_key] = {
						unit: asset.asset_genesis.name,
						amount: 0,
                        amount_oracle: null,
						decimal_display: asset.decimal_display?.decimal_display,
						utxos: 0,
						group_key: asset_key,
                        error_taproot_assets: this.errors_taproot_assets().length > 0,
                        is_bitcoin: false,
					};
				}
				acc[asset_key].amount += amount;
				acc[asset_key].utxos++;
				return acc;
			},
			{} as Record<string, TableRow>,
		);
		return Object.values(grouped_assets);
	}


    /** Toggles the expanded state for a given unit row */
	public toggleExpanded(unit: string): void {
		this.expanded.update((state) => ({...state, [unit]: !state[unit]}));
	}
}