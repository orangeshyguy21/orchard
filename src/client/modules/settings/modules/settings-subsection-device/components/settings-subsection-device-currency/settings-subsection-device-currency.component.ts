/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal, computed, SimpleChanges, OnChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
/* Application Dependencies */
import {Currency, CurrencyType} from '@client/modules/cache/services/local-storage/local-storage.types';

type CurrencyOption = {
	value: CurrencyType;
	label: string;
	details: string;
};

@Component({
	selector: 'orc-settings-subsection-device-currency',
	standalone: false,
	templateUrl: './settings-subsection-device-currency.component.html',
	styleUrl: './settings-subsection-device-currency.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDeviceCurrencyComponent implements OnChanges {
	public readonly currency = input.required<Currency | null>();
	public readonly loading = input.required<boolean>();
	public readonly mode = input.required<keyof Currency>();

	public currencyChange = output<CurrencyType | null>();

	public help_status = signal<boolean>(false);

	public readonly unit = computed<string>(() => {
		return this.mode() === 'type_btc' ? 'sat' : 'USD';
	});
	public readonly example_amount = computed<number>(() => {
		return this.mode() === 'type_btc' ? 1500000 : 1500;
	});
	public readonly options = computed<CurrencyOption[]>(() => {
		if (this.mode() === 'type_btc') {
			return [
				{value: CurrencyType.GLYPH, label: '₿', details: 'Bitcoin symbol per bip 177'},
				{value: CurrencyType.CODE, label: 'sat', details: 'Sats displayed with the word sat'},
			];
		}
		return [
			{value: CurrencyType.GLYPH, label: '$, £, €', details: 'Fiat currency symbol'},
			{value: CurrencyType.CODE, label: 'USD, GBP, EUR', details: 'Fiat currency code'},
		];
	});

	public readonly currency_control = new FormControl<CurrencyType | null>(null);

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading() === false) this.init();
	}

	private init() {
		const currency = this.currency();
		if (currency === null) return;
		this.currency_control.setValue(currency[this.mode()]);
	}

	public getSelectedCurrencyLabel(value: CurrencyType | null): string {
		const option = this.options()?.find((option) => option.value === value);
		if (!option) return '';
		return option.label;
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.currencyChange.emit(this.currency_control.value);
	}
}
