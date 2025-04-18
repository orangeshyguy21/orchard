/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
    selector: 'orc-mint-info-form-url',
    standalone: false,
    templateUrl: './mint-info-form-url.component.html',
    styleUrl: './mint-info-form-url.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormUrlComponent {

	@Input() form_group!: FormGroup;
	@Input() array_name!: string;
    @Input() control_index!: number;

    @Output() update = new EventEmitter<number>();
    @Output() cancel = new EventEmitter<number>();
    @Output() remove = new EventEmitter<number>();

	@ViewChild('element_url') element_url!: ElementRef<HTMLInputElement>;

	public get form_hot(): boolean {
        if( document.activeElement === this.element_url?.nativeElement ) return true;
        return this.form_array.at(this.control_index)?.dirty ? true : false;
    }

	public get form_array(): FormArray {
		return this.form_group.get(this.array_name) as FormArray;
	}
	
    constructor(){}

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.control_index);
        this.element_url.nativeElement.blur();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.control_index);
        this.element_url.nativeElement.blur();
    }

    public onRemove(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.remove.emit(this.control_index);
        this.element_url.nativeElement.blur();
    }
}
