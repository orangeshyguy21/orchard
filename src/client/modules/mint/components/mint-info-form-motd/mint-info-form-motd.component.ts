/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
/* Application Dependencies */
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-info-form-motd',
	standalone: false,
	templateUrl: './mint-info-form-motd.component.html',
	styleUrl: './mint-info-form-motd.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormMotdComponent {

	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintInfoRpc;
    @Input() motd!: string | null;

    @Output() update = new EventEmitter<keyof MintInfoRpc>();
    @Output() cancel = new EventEmitter<keyof MintInfoRpc>();

    @ViewChild('element_motd') element_motd!: ElementRef<HTMLInputElement>;

    public get form_hot(): boolean {
        if( document.activeElement === this.element_motd?.nativeElement ) return true;
        return this.form_group.get(this.control_name)?.dirty ? true : false;
    }

    public get motd_state(): string {
        if( this.form_hot ) return 'hot';
        if( this.form_group.get(this.control_name)?.value === null || this.form_group.get(this.control_name)?.value === '' ) return 'unset';
        return 'set';
    }

    constructor(){}

    public onClick(event: Event): void {
        event.preventDefault();
        this.element_motd.nativeElement.focus();
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_name);
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