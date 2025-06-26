/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'orc-auth-password',
  standalone: false,
  templateUrl: './auth-password.component.html',
  styleUrl: './auth-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPasswordComponent {

	@Input() form_group!: FormGroup;
    @Input() control_name!: string;

	@Output() update = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<string>();

    @ViewChild('element_password') element_password!: ElementRef<HTMLInputElement>;

	public form_error = computed(() => {
		if (this.form_group.get(this.control_name)?.hasError('required')) return 'Required';
		if (this.form_group.get(this.control_name)?.hasError('incorrect')) return 'Incorrect password';
		if (this.form_group.get(this.control_name)?.errors) return 'Invalid password';
		return '';
	});

	// public form_error = computed(() => {
	// 	if (this.form_group.get(this.control_name)?.hasError('required')) return 'Required';
	// 	if (this.form_group.get(this.control_name)?.hasError('min')) return `Must be at least ${this.form_group.get(this.control_name)?.getError("min")?.min}`;
	// 	if (this.form_group.get(this.control_name)?.hasError('orchardInteger')) return 'Must be a whole number';
	// 	if (this.form_group.get(this.control_name)?.hasError('orchardCents')) return 'Must have 2 decimals';
	// 	if (this.form_group.get(this.control_name)?.errors) return 'Invalid amount';
	// 	return '';
	// });

    constructor(){}

    public get form_hot(): boolean {
        if( document.activeElement === this.element_password?.nativeElement ) return true;
        return this.form_group.get(this.control_name)?.dirty ? true : false;
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_name);
        // this.element_password.nativeElement.blur();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.control_name);
        this.element_password.nativeElement.blur();
    }
}