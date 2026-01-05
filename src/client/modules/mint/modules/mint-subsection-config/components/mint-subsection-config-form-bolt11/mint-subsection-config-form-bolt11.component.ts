/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import {OrchardNut4Method, OrchardNut5Method} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-form-bolt11',
	standalone: false,
	templateUrl: './mint-subsection-config-form-bolt11.component.html',
	styleUrl: './mint-subsection-config-form-bolt11.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormBolt11Component {
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

	public form_bolt11 = computed(() => {
		return this.form_group().get(this.unit())?.get(this.method()) as FormGroup;
	});

	public toggle_control = computed((): keyof OrchardNut4Method | keyof OrchardNut5Method => {
		return this.nut() === 'nut4' ? 'description' : 'amountless';
	});

	public toggle_control_name = computed(() => {
		return this.nut() === 'nut4' ? 'Description' : 'Amountless';
	});

	public toggle_help_text = computed(() => {
		if (this.nut() === 'nut4') {
			return 'Allow users to add a description to bolt11 minting invoices.';
		}
		return 'Indicates whether the bolt11 payment method backend supports paying amountless invoices.<br>Not configurable. On/Off determined by lightning backend.';
	});

	public help_status = signal<boolean>(false); // tracks if the help is visible

	private cdr = inject(ChangeDetectorRef);

	constructor() {
		effect(() => {
			if (this.form_status() === true) {
				this.form_bolt11().get(this.toggle_control())?.disable();
			}
		});
	}

	public onMinHot(event: boolean): void {
		setTimeout(() => {
			this.min_hot.set(event);
			this.cdr.markForCheck();
		});
	}

	public onMaxHot(event: boolean): void {
		setTimeout(() => {
			this.max_hot.set(event);
			this.cdr.markForCheck();
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
