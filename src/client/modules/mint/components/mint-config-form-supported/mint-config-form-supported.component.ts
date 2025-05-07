/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Vendor Dependencies */
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
	selector: 'orc-mint-config-form-supported',
	standalone: false,
	templateUrl: './mint-config-form-supported.component.html',
	styleUrl: './mint-config-form-supported.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormSupportedComponent {

	@Input() form_group!: FormGroup;
	@Input() control_name!: string;

	constructor() {}

	public onChange(event: MatSlideToggleChange): void {
		console.log(event);
		this.form_group.get(this.control_name)?.setValue(!event.checked);
	}
}
