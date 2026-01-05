/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	inject,
	input,
	OnDestroy,
	OnInit,
	output,
	signal,
	viewChild,
	ElementRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {MintQuoteTtls} from '@client/modules/mint/classes/mint-quote-ttls.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlComponent implements OnInit, OnDestroy {
	public nut = input.required<'nut4' | 'nut5'>(); // which nut configuration this controls
	public form_group = input.required<FormGroup>(); // form group containing the quote ttl control
	public control_name = input.required<keyof MintQuoteTtls>(); // name of the form control to bind
	public disabled = input<boolean | undefined>(undefined); // whether the form is disabled
	public locale = input.required<string>(); // locale for number formatting
	public loading = input.required<boolean>(); // whether data is loading
	public quotes = input.required<MintMintQuote[] | MintMeltQuote[]>(); // quotes to display in chart

	public update = output<{form_group: FormGroup; control_name: keyof MintQuoteTtls}>(); // emitted when form is submitted
	public cancel = output<{form_group: FormGroup; control_name: keyof MintQuoteTtls}>(); // emitted when form is cancelled

	public element_quote_ttl = viewChild.required<ElementRef<HTMLInputElement>>('element_quote_ttl'); // reference to the input element

	public focused_quote_ttl = signal<boolean>(false); // tracks if the input is focused
	public control_dirty = signal<boolean>(false); // tracks if the control is dirty
	public control_touched = signal<boolean>(false); // tracks if the control has been touched
	public form_error = signal<string>(''); // current form error message
	public help_status = signal<boolean>(true); // tracks if the help is visible

	public form_hot = computed(() => {
		if (this.focused_quote_ttl()) return true;
		return this.control_dirty();
	});

	public control_invalid = computed(() => {
		if (this.focused_quote_ttl()) return false;
		return (this.form_group().get(this.control_name())?.invalid && (this.control_dirty() || this.control_touched())) ?? false;
	});

	public help_text = computed(() => {
		if (this.nut() === 'nut4')
			return 'Configure the time to live for checking deposit invoices.<br> Invoices paid after this time will be checked less often.';
		if (this.nut() === 'nut5')
			return 'Configure the time to live for checking withdraw invoices.<br> Invoices paid after this time will be checked less often.';
		return '';
	});

	private cdr = inject(ChangeDetectorRef);
	private subscription: Subscription = new Subscription();

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
		this.focused_quote_ttl.set(true);
	}

	public onBlur(): void {
		this.focused_quote_ttl.set(false);
		this.control_touched.set(true);
		this.updateFormError();
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit({form_group: this.form_group(), control_name: this.control_name()});
		this.element_quote_ttl().nativeElement.blur();
		this.control_dirty.set(false);
		this.control_touched.set(false);
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit({form_group: this.form_group(), control_name: this.control_name()});
		this.element_quote_ttl().nativeElement.blur();
		this.control_dirty.set(false);
		this.control_touched.set(false);
	}

	private updateFormError(): void {
		const control = this.form_group().get(this.control_name());
		if (control?.hasError('required')) {
			this.form_error.set('Required');
		} else if (control?.hasError('min')) {
			this.form_error.set(`Must be at least ${control.getError('min')?.min}`);
		} else if (control?.hasError('max')) {
			this.form_error.set(`Cannot exceed ${control.getError('max')?.max}`);
		} else if (control?.hasError('orchardMicros')) {
			this.form_error.set('Invalid format');
		} else if (control?.errors) {
			this.form_error.set('Invalid TTL');
		} else {
			this.form_error.set('');
		}
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
