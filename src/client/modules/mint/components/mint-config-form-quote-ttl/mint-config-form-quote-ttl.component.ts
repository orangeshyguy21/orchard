/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
/* Application Dependencies */
import { MintQuoteTtls } from '@client/modules/mint/classes/mint-quote-ttls.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
@Component({
	selector: 'orc-mint-config-form-quote-ttl',
	standalone: false,
	templateUrl: './mint-config-form-quote-ttl.component.html',
	styleUrl: './mint-config-form-quote-ttl.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('150ms ease-out', style({ opacity: 0 }))
			])
		])
	]
})
export class MintConfigFormQuoteTtlComponent {

	@Input() nut!: 'nut4' | 'nut5';
	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintQuoteTtls;
	@Input() disabled!: boolean | undefined;
	@Input() locale!: string;
	@Input() loading!: boolean;
	@Input() quotes!: MintMintQuote[] | MintMeltQuote[];

    @Output() update = new EventEmitter<{form_group: FormGroup, control_name: keyof MintQuoteTtls}>();
    @Output() cancel = new EventEmitter<{form_group: FormGroup, control_name: keyof MintQuoteTtls}>();

	@ViewChild('element_quote_ttl') element_quote_ttl!: ElementRef<HTMLInputElement>;

	public get form_error(): string {
		if (this.form_group.get(this.control_name)?.hasError('required')) return 'Required';
		if (this.form_group.get(this.control_name)?.hasError('min')) return `Must be at least ${this.form_group.get(this.control_name)?.getError("min")?.min}`;
		if (this.form_group.get(this.control_name)?.hasError('max')) return `Cannot exceed ${this.form_group.get(this.control_name)?.getError("max")?.max}`;
		if (this.form_group.get(this.control_name)?.hasError('orchardMicros')) return 'Invalid format';
		if (this.form_group.get(this.control_name)?.errors) return 'Invalid TTL';
		return '';
	};

	public help_text = computed(() => {
		if( this.nut === 'nut4' ) return 'Configure the time to live for checking deposit invoices. Invoices paid after this time will be checked less often.';
		if( this.nut === 'nut5' ) return 'Configure the time to live for checking withdraw invoices. Invoices paid after this time will be checked less often.';
		return '';
	});

	constructor(){}

	public get form_hot(): boolean {
		if( document.activeElement === this.element_quote_ttl?.nativeElement ) return true;
		return this.form_group.get(this.control_name)?.dirty ? true : false;
	}

	public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit({form_group: this.form_group, control_name: this.control_name});
        this.element_quote_ttl.nativeElement.blur();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit({form_group: this.form_group, control_name: this.control_name});
        this.element_quote_ttl.nativeElement.blur();
    }
}