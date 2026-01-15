/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, input} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';
import {FormAutogrowDirective} from '@client/modules/form/directives/form-autogrow/form-autogrow.directive';

@Component({
	selector: 'orc-mint-subsection-info-form-motd',
	standalone: false,
	templateUrl: './mint-subsection-info-form-motd.component.html',
	styleUrl: './mint-subsection-info-form-motd.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormMotdComponent {
	@Input() form_group!: FormGroup;
	@Input() control_name!: keyof MintInfoRpc;
	@Input() motd!: string | null;
	public device_mobile = input.required<boolean>();

	@Output() update = new EventEmitter<keyof MintInfoRpc>();
	@Output() cancel = new EventEmitter<keyof MintInfoRpc>();

	@ViewChild('element_motd') element_motd!: ElementRef<HTMLInputElement>;
	@ViewChild(FormAutogrowDirective) autogrow!: FormAutogrowDirective;

	public get form_hot(): boolean {
		if (document.activeElement === this.element_motd?.nativeElement) return true;
		return this.form_group.get(this.control_name)?.dirty ? true : false;
	}

	public get motd_state(): string {
		if (this.form_hot) return 'hot';
		if (this.form_group.get(this.control_name)?.value === null || this.form_group.get(this.control_name)?.value === '') return 'unset';
		return 'set';
	}

	constructor() {}

	public onClick(event: Event): void {
		event.preventDefault();
		this.element_motd.nativeElement.focus();
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.update.emit(this.control_name);
		setTimeout(() => {
			this.autogrow.grow();
		}, 10);
		this.element_motd.nativeElement.blur();
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit(this.control_name);
		this.element_motd.nativeElement.blur();
	}

	public onDelete(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.form_group.get(this.control_name)?.setValue(null);
		this.update.emit(this.control_name);
		this.element_motd.nativeElement.blur();
	}
}
