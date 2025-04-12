/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
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

    @ViewChild('element_name') element_name!: ElementRef<HTMLInputElement>;

    public form_name: FormControl = new FormControl('');

    public get appearance(): 'fill' | 'outline' {
        if( !this.element_name?.nativeElement ) return 'outline';
        if( document.activeElement === this.element_name.nativeElement ) return 'fill';
        return this.form_name.dirty ? 'fill' : 'outline';
    }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['name']) {
			this.form_name.setValue(this.name);
		}
	}
}



// /* Core Dependencies */
// import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
// import { FormControl } from '@angular/forms';

// @Component({
//     selector: 'orc-mint-info-form-name',
//     standalone: false,
//     templateUrl: './mint-info-form-name.component.html',
//     styleUrl: './mint-info-form-name.component.scss',
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class MintInfoFormNameComponent implements OnChanges {

//     @Input() name!: string;
//     @ViewChild('name_input') name_input!: ElementRef<HTMLInputElement>;

//     public form_name: FormControl = new FormControl('');

//     ngOnChanges(changes: SimpleChanges): void {
//         if (changes['name']) {
//             this.form_name.setValue(this.name);
//         }
//     }

//     public isInputFocused(): boolean {
//         return document.activeElement === this.name_input.nativeElement;
//     }
// }