/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef, computed} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {OrchardNut4Method, OrchardNut5Method} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-config-form-max',
	standalone: false,
	templateUrl: './mint-config-form-max.component.html',
	styleUrl: './mint-config-form-max.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintConfigFormMaxComponent {
	@Input() form_group!: FormGroup;
	@Input() control_name!: keyof OrchardNut4Method | keyof OrchardNut5Method;
	@Input() unit!: string;
	@Input() nut!: 'nut4' | 'nut5';

	@Output() update = new EventEmitter<keyof OrchardNut4Method | keyof OrchardNut5Method>();
	@Output() cancel = new EventEmitter<keyof OrchardNut4Method | keyof OrchardNut5Method>();
	@Output() hot = new EventEmitter<boolean>();

	@ViewChild('element_max') element_max!: ElementRef<HTMLInputElement>;

	public get form_error(): string {
		if (this.form_group.get(this.control_name)?.hasError('required')) return 'Required';
		if (this.form_group.get(this.control_name)?.hasError('min'))
			return `Must be at least ${this.form_group.get(this.control_name)?.getError('min')?.min}`;
		if (this.form_group.get(this.control_name)?.hasError('orchardInteger')) return 'Must be a whole number';
		if (this.form_group.get(this.control_name)?.hasError('orchardCents')) return 'Must have 2 decimals';
		if (this.form_group.get(this.control_name)?.errors) return 'Invalid amount';
		return '';
	}

	public help_text = computed(() => {
		if (this.nut === 'nut4') return 'Configure the maximum amount of ecash that can be minted per deposit invoice.';
		if (this.nut === 'nut5') return 'Configure the maximum amount of ecash that can be melted per withdrawal invoice.';
		return '';
	});

	public get form_hot(): boolean {
		if (document.activeElement === this.element_max?.nativeElement) {
			this.hot.emit(true);
			return true;
		}
		if (this.form_group?.get(this.control_name)?.dirty) {
			this.hot.emit(true);
			return true;
		}
		this.hot.emit(false);
		return false;
	}

	constructor() {}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name);
		this.element_max.nativeElement.blur();
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name);
		this.element_max.nativeElement.blur();
	}
}
