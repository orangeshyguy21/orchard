/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef, computed, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'orc-auth-password',
  standalone: false,
  templateUrl: './auth-password.component.html',
  styleUrl: './auth-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPasswordComponent {

    @ViewChild('element_password') element_password!: ElementRef<HTMLInputElement>;

	@Input() form_group!: FormGroup;
    @Input() control_name!: string;

	@Output() update = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<string>();

    public password_visible = signal(false);

	public form_error = computed(() => {
        if (this.form_group.get(this.control_name)?.hasError('incorrect')) return 'Incorrect password';
		if (this.form_group.get(this.control_name)?.hasError('required')) return 'Required';
		if (this.form_group.get(this.control_name)?.errors) return 'Invalid password';
		return '';
	});

    constructor(){}

    public get form_hot(): boolean {
        if( document.activeElement === this.element_password?.nativeElement ) return true;
        return this.form_group.get(this.control_name)?.dirty ? true : false;
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_name);
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.control_name);
        this.element_password.nativeElement.blur();
    }

    public togglePasswordVisibility(): void {
        this.password_visible.set(!this.password_visible());
    }
}