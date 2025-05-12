/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
/* Application Dependencies */
import { OrchardNut4Method, OrchardNut5Method } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-config-form-bolt11',
	standalone: false,
	templateUrl: './mint-config-form-bolt11.component.html',
	styleUrl: './mint-config-form-bolt11.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormBolt11Component implements OnChanges {

	@Input() nut!: 'nut4' | 'nut5';
	@Input() index!: number;
	@Input() unit!: string;
	@Input() method!: string;
	@Input() form_group!: FormGroup;
	@Input() form_status!: boolean;

	@Output() update = new EventEmitter<{nut: 'nut4' | 'nut5', unit: string, method: string, control_name: keyof OrchardNut4Method | keyof OrchardNut5Method, form_group: FormGroup}>();
	@Output() cancel = new EventEmitter<{nut: 'nut4' | 'nut5', unit: string, method: string, control_name: keyof OrchardNut4Method | keyof OrchardNut5Method, form_group: FormGroup}>();

	public get form_bolt11(): FormGroup {
		return this.form_group.get(this.unit)?.get(this.method) as FormGroup;
	}

	public get toggle_control() : keyof OrchardNut4Method | keyof OrchardNut5Method {
		return this.nut === 'nut4' ? 'description' : 'amountless';
	}

	public get toggle_control_name() : string {
		return this.nut === 'nut4' ? 'Description' : 'Amountless';
	}

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if( changes['form_status'] && this.form_status === true ) {
			this.form_bolt11.get(this.toggle_control)?.disable();
		}
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
		this.form_bolt11.get(this.toggle_control)?.setValue(event.checked);
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
