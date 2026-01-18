/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	input,
	output,
	signal,
	computed,
	SimpleChanges,
	OnChanges,
	viewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';
/* Application Dependencies */
import {Currency, CurrencyType} from '@client/modules/cache/services/local-storage/local-storage.types';

type CurrencyOption = {
	value: CurrencyType;
	label: string;
	details: string;
};

const EXAMPLE_AMOUNT = {
	type_btc: 58200,
	type_fiat: 128.55,
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
	public readonly locale = input.required<string>();

	public currencyChange = output<CurrencyType | null>();

	readonly flash = viewChild<ElementRef>('flash');

	public help_status = signal<boolean>(false);
	public example_amount = signal<number>(0);

	public readonly unit = computed<string>(() => {
		return this.mode() === 'type_btc' ? 'sat' : 'USD';
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
		if (changes['mode'] && this.mode()) this.example_amount.set(EXAMPLE_AMOUNT[this.mode()]);
		if (changes['currency'] && !changes['currency'].firstChange && this.currency()) this.flashExampleAmount();
		if (changes['locale'] && !changes['locale'].firstChange && this.locale()) this.flashExampleAmount();
	}

	private init() {
		const currency = this.currency();
		if (currency === null) return;
		this.currency_control.setValue(currency[this.mode()]);
	}

	private flashExampleAmount(): void {
		this.example_amount.set(0);
		setTimeout(() => {
			this.example_amount.set(EXAMPLE_AMOUNT[this.mode()]);
			this.animateFlash();
		});
	}

	private animateFlash(): void {
		const flash = this.flash()?.nativeElement;
		if (!flash) return;
		for (const anim of flash.getAnimations()) anim.cancel();
		flash
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
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
