/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
/* Application Dependencies */
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-info-form-urls',
	standalone: false,
	templateUrl: './mint-info-form-urls.component.html',
	styleUrl: './mint-info-form-urls.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormUrlsComponent {
	@Input() form_group!: FormGroup;
    @Input() control_name!: keyof MintInfoRpc;

    @Output() update = new EventEmitter<keyof MintInfoRpc>();
    @Output() cancel = new EventEmitter<keyof MintInfoRpc>();

    // @ViewChild('element_name') element_name!: ElementRef<HTMLInputElement>;

	public get urls_array(): FormArray {
		return this.form_group?.get(this.control_name) as FormArray;
	}

    constructor(){}

    // public get form_hot(): boolean {
    //     if( document.activeElement === this.element_name?.nativeElement ) return true;
    //     return this.form_group.get(this.control_name)?.dirty ? true : false;
    // }

    public onIndexUpdate(index: number): void {
        console.log('onIndexUpdate', index);
    }

    public onIndexCancel(index: number): void {
        console.log('onIndexCancel', index);
    }

    // public onCancel(event: Event): void {
    //     event.preventDefault();
    //     this.cancel.emit(this.control_name);
    //     this.element_name.nativeElement.blur();
    // }
}