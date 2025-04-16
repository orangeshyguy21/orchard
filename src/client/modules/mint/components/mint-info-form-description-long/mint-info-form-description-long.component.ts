/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Application Dependencies */
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-info-form-description-long',
	standalone: false,
	templateUrl: './mint-info-form-description-long.component.html',
	styleUrl: './mint-info-form-description-long.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormDescriptionLongComponent {

	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintInfoRpc;

    @Output() update = new EventEmitter<keyof MintInfoRpc>();
    @Output() cancel = new EventEmitter<keyof MintInfoRpc>();

	@ViewChild('element_description_long') element_description_long!: ElementRef<HTMLInputElement>;
	
    constructor(){}

    public get form_hot(): boolean {
        if( document.activeElement === this.element_description_long?.nativeElement ) return true;
        return this.form_group.get(this.control_name)?.dirty ? true : false;
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_name);
        this.element_description_long.nativeElement.blur();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.control_name);
        this.element_description_long.nativeElement.blur();
    }
}
