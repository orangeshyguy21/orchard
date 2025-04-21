/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
/* Vendor Dependencies */
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';

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
	@Input() init_method!: string;

    @Output() update = new EventEmitter<number>();
    @Output() cancel = new EventEmitter<number>();
    @Output() remove = new EventEmitter<number>();

	@ViewChild('element_method') element_method!: MatSelect;
	@ViewChild('element_info') element_info!: ElementRef<HTMLInputElement>;

	public get contact_icon(): string {
		const method = this.form_array.at(this.subgroup_index).get('method')?.value;
		if( method === 'email' ) return 'mail';
		if( method === 'nostr' ) return 'nostr';
		if( method === 'twitter' ) return 'x';
		return 'mail';
	}

	public get form_hot(): boolean {
		if( this.element_method?.focused || this.element_method?.panelOpen || document.activeElement === this.element_info?.nativeElement ) return true;
        return this.form_array.at(this.subgroup_index)?.dirty ? true : false;
    }
	
	constructor(){}

    ngAfterViewInit(): void {
        if( this.focused ){
            setTimeout(() => {
                this.element_info.nativeElement.focus();
            });
        }
		if( this.init_method ) this.form_array.at(this.subgroup_index).get('method')?.setValue(this.init_method);
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        this.update.emit(this.subgroup_index);
        this.element_info.nativeElement.blur();
		this.element_method.close();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        this.cancel.emit(this.subgroup_index);
        this.element_info.nativeElement.blur();
		this.element_method.close();
    }

    public onRemove(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.remove.emit(this.subgroup_index);
        this.element_info.nativeElement.blur();
		this.element_method.close();
    }
}