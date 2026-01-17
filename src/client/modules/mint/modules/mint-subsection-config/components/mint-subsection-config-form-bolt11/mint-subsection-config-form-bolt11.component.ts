/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, output, signal, SimpleChanges, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {avg, median, max, min} from '@client/modules/math/helpers';
/* Native Dependencies */
import {MintConfigStats} from '@client/modules/mint/modules/mint-subsection-config/types/mint-config-stats.type';
/* Shared Dependencies */
import {MintQuoteState, MeltQuoteState, OrchardNut4Method, OrchardNut5Method} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-form-bolt11',
	standalone: false,
	templateUrl: './mint-subsection-config-form-bolt11.component.html',
	styleUrl: './mint-subsection-config-form-bolt11.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormBolt11Component implements OnChanges {
	public nut = input.required<'nut4' | 'nut5'>(); // which nut configuration this controls
	public unit = input.required<string>(); // unit to display (e.g. 'sat')
	public method = input.required<string>(); // payment method (e.g. 'bolt11')
	public form_group = input.required<FormGroup>(); // form group containing the bolt11 controls
	public form_status = input<boolean>(false); // whether the form is in a specific status
	public locale = input.required<string>(); // locale for number formatting
	public loading = input.required<boolean>(); // whether data is loading
	public quotes = input.required<MintMintQuote[] | MintMeltQuote[]>(); // quotes to display in chart

	public update = output<{
		nut: 'nut4' | 'nut5';
		unit: string;
		method: string;
		control_name: keyof OrchardNut4Method | keyof OrchardNut5Method;
		form_group: FormGroup;
	}>(); // emitted when form is submitted
	public cancel = output<{
		nut: 'nut4' | 'nut5';
		unit: string;
		method: string;
		control_name: keyof OrchardNut4Method | keyof OrchardNut5Method;
		form_group: FormGroup;
	}>(); // emitted when form is cancelled

	public min_hot = signal<boolean>(false); // tracks if min input is hot
	public max_hot = signal<boolean>(false); // tracks if max input is hot
	public stat_amounts = signal<Record<string, number>[]>([]); // amounts for the stats
	public stats = signal<MintConfigStats>({
		avg: 0,
		median: 0,
		max: 0,
		min: 0,
	}); // stats for the quote ttl

	public form_bolt11 = computed(() => {
		return this.form_group().get(this.unit())?.get(this.method()) as FormGroup;
	});

	public toggle_control = computed((): keyof OrchardNut4Method | keyof OrchardNut5Method => {
		return this.nut() === 'nut4' ? 'description' : 'amountless';
	});

	public toggle_control_name = computed(() => {
		return this.nut() === 'nut4' ? 'Description' : 'Amountless';
	});

	public valid_quotes = computed(() => {
		const quotes = this.nut() === 'nut4' ? (this.quotes() as MintMintQuote[]) : (this.quotes() as MintMeltQuote[]);
		const valid_state = this.nut() === 'nut4' ? MintQuoteState.Issued : MeltQuoteState.Paid;
		return quotes
			.filter((quote) => quote.state === valid_state && quote.created_time && quote.created_time > 0 && quote.unit === this.unit())
			.sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0)) as MintMintQuote[] | MintMeltQuote[];
	});

	public toggle_help_text = computed(() => {
		if (this.nut() === 'nut4') {
			return 'Allow users to add a description to bolt11 minting invoices.';
		}
		return 'Indicates whether the bolt11 payment method backend supports paying amountless invoices.<br>Not configurable. On/Off determined by lightning backend.';
	});

	public help_status = signal<boolean>(false); // tracks if the help is visible

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['form_status'] && this.form_status() === true) {
			this.form_bolt11().get(this.toggle_control())?.disable();
		}
		if (changes['loading'] && this.loading() === false) {
			this.setStats();
		}
	}

	private setStats(): void {
		const amounts = this.getAmounts();
		this.stat_amounts.set(amounts);
		const stats = this.getStats(amounts);
		this.stats.set(stats);
	}

	private getAmounts(): Record<string, number>[] {
		const valid_quotes = this.valid_quotes();
		if (valid_quotes.length === 0) return [];
		return valid_quotes.map((quote) => ({
			created_time: quote.created_time ?? 0,
			amount: this.getEffectiveAmount(quote),
		}));
	}

	private getEffectiveAmount(entity: MintMintQuote | MintMeltQuote): number {
		if (entity instanceof MintMintQuote) return entity.amount_issued;
		return entity.amount;
	}

	private getStats(amounts: Record<string, number>[]): {
		avg: number;
		median: number;
		max: number;
		min: number;
	} {
		const values = amounts.map((amount) => amount['amount']);
		return {
			avg: avg(values, true),
			median: median(values, true),
			max: max(values),
			min: min(values),
		};
	}

	public onMinHot(event: boolean): void {
		setTimeout(() => {
			this.min_hot.set(event);
		});
	}

	public onMaxHot(event: boolean): void {
		setTimeout(() => {
			this.max_hot.set(event);
		});
	}

	public onUpdate(control_name: keyof OrchardNut4Method | keyof OrchardNut5Method): void {
		this.update.emit({
			nut: this.nut(),
			unit: this.unit(),
			method: this.method(),
			form_group: this.form_group(),
			control_name: control_name,
		});
	}

	public onToggle(event: MatSlideToggleChange): void {
		this.form_bolt11().get(this.toggle_control())?.setValue(event.checked);
		this.onUpdate(this.toggle_control());
	}

	public onCancel(control_name: keyof OrchardNut4Method | keyof OrchardNut5Method): void {
		this.cancel.emit({
			nut: this.nut(),
			unit: this.unit(),
			method: this.method(),
			form_group: this.form_group(),
			control_name: control_name,
		});
	}
}
