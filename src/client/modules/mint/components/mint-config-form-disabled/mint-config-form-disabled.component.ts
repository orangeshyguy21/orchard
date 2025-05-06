/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Vendor Dependencies */
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
	selector: 'orc-mint-config-form-disabled',
	standalone: false,
	templateUrl: './mint-config-form-disabled.component.html',
	styleUrl: './mint-config-form-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormDisabledComponent {

	@Input() form_group!: FormGroup;
	@Input() control_name!: string;

	constructor() {}

	public onChange(event: MatSlideToggleChange): void {
		console.log(event);
		this.form_group.get(this.control_name)?.setValue(!event.checked);
	}

	// public supported = new FormControl(false);

}
