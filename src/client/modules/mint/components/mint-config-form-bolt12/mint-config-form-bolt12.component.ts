/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import {OrchardNut4Method, OrchardNut5Method} from '@shared/generated.types';

@Component({
    selector: 'orc-mint-config-form-bolt12',
    standalone: false,
    templateUrl: './mint-config-form-bolt12.component.html',
    styleUrl: './mint-config-form-bolt12.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormBolt12Component {
	@Input() nut!: 'nut4' | 'nut5';
	@Input() index!: number;
	@Input() unit!: string;
	@Input() method!: string;
	@Input() form_group!: FormGroup;
	@Input() form_status!: boolean;
	@Input() locale!: string;
	@Input() loading!: boolean;
	@Input() quotes!: MintMintQuote[] | MintMeltQuote[];

	@Output() update = new EventEmitter<{
		nut: 'nut4' | 'nut5';
		unit: string;
		method: string;
		control_name: keyof OrchardNut4Method | keyof OrchardNut5Method;
		form_group: FormGroup;
	}>();
	@Output() cancel = new EventEmitter<{
		nut: 'nut4' | 'nut5';
		unit: string;
		method: string;
		control_name: keyof OrchardNut4Method | keyof OrchardNut5Method;
		form_group: FormGroup;
	}>();

	public min_hot: boolean = false;
	public max_hot: boolean = false;

	public get form_bolt12(): FormGroup {
		return this.form_group.get(this.unit)?.get(this.method) as FormGroup;
	}

	public get toggle_control(): keyof OrchardNut4Method | keyof OrchardNut5Method {
		return this.nut === 'nut4' ? 'description' : 'amountless';
	}

	public get toggle_control_name(): string {
		return this.nut === 'nut4' ? 'Description' : 'Amountless';
	}

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['form_status'] && this.form_status === true) {
			this.form_bolt12.get(this.toggle_control)?.disable();
		}
	}

	public onMinHot(event: boolean): void {
		setTimeout(() => {
			this.min_hot = event;
			this.cdr.markForCheck();
		});
	}

	public onMaxHot(event: boolean): void {
		setTimeout(() => {
			this.max_hot = event;
			this.cdr.markForCheck();
		});
	}

	public onUpdate(control_name: keyof OrchardNut4Method | keyof OrchardNut5Method): void {
		this.update.emit({
			nut: this.nut,
			unit: this.unit,
			method: this.method,
			form_group: this.form_group,
			control_name: control_name,
		});
	}

	public onToggle(event: MatSlideToggleChange): void {
		this.form_bolt12.get(this.toggle_control)?.setValue(event.checked);
		this.onUpdate(this.toggle_control);
	}

	public onCancel(control_name: keyof OrchardNut4Method | keyof OrchardNut5Method): void {
		this.cancel.emit({
			nut: this.nut,
			unit: this.unit,
			method: this.method,
			form_group: this.form_group,
			control_name: control_name,
		});
	}
}
