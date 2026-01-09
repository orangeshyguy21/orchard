/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, output, signal, viewChild} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {startWith, switchMap} from 'rxjs';
/* Application Dependencies */
import {OrchardNut4Method, OrchardNut5Method} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-form-min',
	standalone: false,
	templateUrl: './mint-subsection-config-form-min.component.html',
	styleUrl: './mint-subsection-config-form-min.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormMinComponent {
	public form_group = input.required<FormGroup>(); // form group containing the min amount control
	public control_name = input.required<keyof OrchardNut4Method | keyof OrchardNut5Method>(); // name of the form control to bind
	public unit = input.required<string>(); // unit to display (e.g. 'sat')
	public nut = input.required<'nut4' | 'nut5'>(); // which nut configuration this controls
	public stat_amounts = input.required<Record<string, number>[]>(); // amounts for the stats

	public update = output<keyof OrchardNut4Method | keyof OrchardNut5Method>(); // emitted when form is submitted
	public cancel = output<keyof OrchardNut4Method | keyof OrchardNut5Method>(); // emitted when form is cancelled
	public hot = output<boolean>(); // emitted when form hot state changes

	public element_min = viewChild.required<ElementRef<HTMLInputElement>>('element_min'); // reference to the input element

	public focused_min = signal<boolean>(false); // tracks if the input is focused
	public control_touched = signal<boolean>(false); // tracks if the control has been touched
	public help_status = signal<boolean>(false); // tracks if the help is visible

	private formChanges = toSignal(toObservable(this.form_group).pipe(switchMap((fg) => fg.valueChanges.pipe(startWith(fg.value)))));

	public control_dirty = computed(() => {
		this.formChanges();
		return this.form_group().get(this.control_name())?.dirty ?? false;
	});

	public form_error = computed(() => {
		this.formChanges();
		const control = this.form_group().get(this.control_name());
		if (control?.hasError('required')) return 'Required';
		if (control?.hasError('min')) return `Must be at least ${control.getError('min')?.min}`;
		if (control?.hasError('orchardInteger')) return 'Must be a whole number';
		if (control?.hasError('orchardCents')) return 'Must have 2 decimals';
		if (control?.errors) return 'Invalid amount';
		return '';
	});

	public form_hot = computed(() => {
		if (this.focused_min()) return true;
		return this.control_dirty();
	});

	public control_invalid = computed(() => {
		if (this.focused_min()) return false;
		return (this.form_group().get(this.control_name())?.invalid && (this.control_dirty() || this.control_touched())) ?? false;
	});

	public help_text = computed(() => {
		if (this.nut() === 'nut4') return 'Configure the minimum amount of ecash that can be minted per deposit invoice.';
		if (this.nut() === 'nut5') return 'Configure the minimum amount of ecash that can be melted per withdrawal invoice.';
		return '';
	});

	constructor() {
		effect(() => {
			this.hot.emit(this.form_hot());
		});
	}

	public onFocus(): void {
		this.focused_min.set(true);
	}

	public onBlur(): void {
		this.focused_min.set(false);
		this.control_touched.set(true);
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name());
		this.element_min().nativeElement.blur();
		this.form_group().get(this.control_name())?.markAsPristine();
		this.control_touched.set(false);
		this.focused_min.set(false);
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name());
		this.element_min().nativeElement.blur();
		this.form_group().get(this.control_name())?.markAsPristine();
		this.control_touched.set(false);
		this.focused_min.set(false);
	}
}
