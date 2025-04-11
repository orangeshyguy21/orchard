

/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

    public form_name: FormControl = new FormControl('');

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['name']) {
			this.form_name.setValue(this.name);
		}
	}
}