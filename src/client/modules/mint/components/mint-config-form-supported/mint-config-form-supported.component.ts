/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Vendor Dependencies */
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
/* Shared Dependencies */
import { OrchardNut4Method, OrchardNut5Method } from '@shared/generated.types';


@Component({
	selector: 'orc-mint-config-form-supported',
	standalone: false,
	templateUrl: './mint-config-form-supported.component.html',
	styleUrl: './mint-config-form-supported.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormSupportedComponent {

	@Input() nut!: 'nut4' | 'nut5';
	@Input() form_group!: FormGroup;

	@Output() update = new EventEmitter<{form_group: FormGroup, nut: 'nut4' | 'nut5'}>();

	constructor() {}

	public onChange(event: MatSlideToggleChange): void {
		this.form_group.get('supported')?.setValue(event.checked);
		this.update.emit({form_group: this.form_group, nut: this.nut});
	}
}
