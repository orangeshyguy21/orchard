/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
	selector: 'orc-mint-info-form-contact',
	standalone: false,
	templateUrl: './mint-info-form-contact.component.html',
	styleUrl: './mint-info-form-contact.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormContactComponent implements AfterViewInit {

	@Input() form_group!: FormGroup;
    @Input() form_array!: FormArray;
	@Input() array_name!: string;
    @Input() subgroup_index!: number;
    @Input() focused!: boolean;

    @Output() update = new EventEmitter<number>();
    @Output() cancel = new EventEmitter<number>();
    @Output() remove = new EventEmitter<number>();

	@ViewChild('element_contact') element_contact!: ElementRef<HTMLInputElement>;

	public get form_hot(): boolean {
        if( document.activeElement === this.element_contact?.nativeElement ) return true;
        return this.form_array.at(this.subgroup_index)?.dirty ? true : false;
    }

	constructor(){}

    ngAfterViewInit(): void {
        if( this.focused ){
            setTimeout(() => {
                this.element_contact.nativeElement.focus();
            });
        }

		console.log(this.form_array.at(this.subgroup_index));
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.subgroup_index);
        this.element_contact.nativeElement.blur();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.subgroup_index);
        this.element_contact.nativeElement.blur();
    }

    public onRemove(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.remove.emit(this.subgroup_index);
        this.element_contact.nativeElement.blur();
    }
}