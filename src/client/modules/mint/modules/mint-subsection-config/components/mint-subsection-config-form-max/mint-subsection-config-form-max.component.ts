/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	OnDestroy,
	OnInit,
	output,
	signal,
	viewChild,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {OrchardNut4Method, OrchardNut5Method} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-form-max',
	standalone: false,
	templateUrl: './mint-subsection-config-form-max.component.html',
	styleUrl: './mint-subsection-config-form-max.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormMaxComponent implements OnInit, OnDestroy {
	public form_group = input.required<FormGroup>(); // form group containing the max amount control
	public control_name = input.required<keyof OrchardNut4Method | keyof OrchardNut5Method>(); // name of the form control to bind
	public unit = input.required<string>(); // unit to display (e.g. 'sat')
	public nut = input.required<'nut4' | 'nut5'>(); // which nut configuration this controls

	public update = output<keyof OrchardNut4Method | keyof OrchardNut5Method>(); // emitted when form is submitted
	public cancel = output<keyof OrchardNut4Method | keyof OrchardNut5Method>(); // emitted when form is cancelled
	public hot = output<boolean>(); // emitted when form hot state changes

	public element_max = viewChild.required<ElementRef<HTMLInputElement>>('element_max'); // reference to the input element

	public focused_max = signal<boolean>(false); // tracks if the input is focused
	public control_dirty = signal<boolean>(false); // tracks if the control is dirty
	public control_touched = signal<boolean>(false); // tracks if the control has been touched
	public form_error = signal<string>(''); // current form error message
	public help_status = signal<boolean>(false); // tracks if the help is visible

	public form_hot = computed(() => {
		if (this.focused_max()) return true;
		return this.control_dirty();
	});

	public control_invalid = computed(() => {
		if (this.focused_max()) return false;
		return (this.form_group().get(this.control_name())?.invalid && (this.control_dirty() || this.control_touched())) ?? false;
	});

	public help_text = computed(() => {
		if (this.nut() === 'nut4') return 'Configure the maximum amount of ecash that can be minted per deposit invoice.';
		if (this.nut() === 'nut5') return 'Configure the maximum amount of ecash that can be melted per withdrawal invoice.';
		return '';
	});

	private cdr = inject(ChangeDetectorRef);
	private subscription: Subscription = new Subscription();

	constructor() {
		effect(() => {
			this.hot.emit(this.form_hot());
		});
	}

	ngOnInit(): void {
		this.subscription.add(
			this.form_group().valueChanges.subscribe(() => {
				this.control_dirty.set(this.form_group().get(this.control_name())?.dirty ?? false);
				this.updateFormError();
				this.cdr.detectChanges();
			}),
		);
	}

	public onFocus(): void {
		this.focused_max.set(true);
	}

	public onBlur(): void {
		this.focused_max.set(false);
		this.control_touched.set(true);
		this.updateFormError();
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name());
		this.element_max().nativeElement.blur();
		this.control_dirty.set(false);
		this.control_touched.set(false);
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name());
		this.element_max().nativeElement.blur();
		this.control_dirty.set(false);
		this.control_touched.set(false);
	}

	private updateFormError(): void {
		const control = this.form_group().get(this.control_name());
		if (control?.hasError('required')) {
			this.form_error.set('Required');
		} else if (control?.hasError('min')) {
			this.form_error.set(`Must be at least ${control.getError('min')?.min}`);
		} else if (control?.hasError('orchardInteger')) {
			this.form_error.set('Must be a whole number');
		} else if (control?.hasError('orchardCents')) {
			this.form_error.set('Must have 2 decimals');
		} else if (control?.errors) {
			this.form_error.set('Invalid amount');
		} else {
			this.form_error.set('');
		}
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
