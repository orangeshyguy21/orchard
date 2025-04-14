/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'orc-mint-info-form-name',
    standalone: false,
    templateUrl: './mint-info-form-name.component.html',
    styleUrl: './mint-info-form-name.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormNameComponent implements OnChanges {

	@Input() name!: string;

    @Output() update = new EventEmitter<string>();

    @ViewChild('element_name') element_name!: ElementRef<HTMLInputElement>;

    public form_name: FormControl = new FormControl('');

    public get form_hot(): boolean {
        if( document.activeElement === this.element_name?.nativeElement ) return true;
        return this.form_name.dirty ? true : false;
    }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['name']) {
			this.form_name.setValue(this.name);
		}
	}

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.form_name.value);
        this.element_name.nativeElement.blur();
        this.form_name.markAsPristine();
    }

    public onCancel() {
        this.element_name.nativeElement.blur();
        this.form_name.setValue(this.name);
        this.form_name.markAsPristine();
    }
}
