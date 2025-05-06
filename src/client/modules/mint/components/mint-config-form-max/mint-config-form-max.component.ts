/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Application Dependencies */
import { OrchardNut4Method, OrchardNut5Method } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-config-form-max',
	standalone: false,
	templateUrl: './mint-config-form-max.component.html',
	styleUrl: './mint-config-form-max.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigFormMaxComponent {
	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof OrchardNut4Method | keyof OrchardNut5Method;

    @Output() update = new EventEmitter<keyof OrchardNut4Method | keyof OrchardNut5Method>();
    @Output() cancel = new EventEmitter<keyof OrchardNut4Method | keyof OrchardNut5Method>();

	@ViewChild('element_max') element_max!: ElementRef<HTMLInputElement>;

	constructor(){}

	public get form_hot(): boolean {
		if( document.activeElement === this.element_max?.nativeElement ) return true;
		return this.form_group.get(this.control_name)?.dirty ? true : false;
	}

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
