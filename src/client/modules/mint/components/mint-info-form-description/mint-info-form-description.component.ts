/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'orc-mint-info-form-description',
	standalone: false,
	templateUrl: './mint-info-form-description.component.html',
	styleUrl: './mint-info-form-description.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormDescriptionComponent implements OnChanges {

	@Input() description!: string | null;

	public form_description: FormControl = new FormControl('');

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['description']) {
			this.form_description.setValue(this.description);
		}
	}
}