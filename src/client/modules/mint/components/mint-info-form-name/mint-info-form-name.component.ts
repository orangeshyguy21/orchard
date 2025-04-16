/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Application Dependencies */
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
    selector: 'orc-mint-info-form-name',
    standalone: false,
    templateUrl: './mint-info-form-name.component.html',
    styleUrl: './mint-info-form-name.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormNameComponent {

    @Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintInfoRpc;

    @Output() update = new EventEmitter<keyof MintInfoRpc>();
    @Output() cancel = new EventEmitter<keyof MintInfoRpc>();

    @ViewChild('element_name') element_name!: ElementRef<HTMLInputElement>;

    constructor(){}

    public get form_hot(): boolean {
        if( document.activeElement === this.element_name?.nativeElement ) return true;
        return this.form_group.get(this.control_name)?.dirty ? true : false;
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_name);
        this.element_name.nativeElement.blur();
    }

    public onCancel() {
        this.cancel.emit(this.control_name);
        this.element_name.nativeElement.blur();
    }
}
