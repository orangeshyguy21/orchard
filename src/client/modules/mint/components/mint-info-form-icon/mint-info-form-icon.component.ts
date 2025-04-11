/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'orc-mint-info-form-icon',
	standalone: false,
	templateUrl: './mint-info-form-icon.component.html',
	styleUrl: './mint-info-form-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintInfoFormIconComponent implements OnChanges {

	@Input() icon_url!: string | null;

	public show_url_input: boolean = false;
	public display_icon: string = '';
	public form_icon_url: FormControl = new FormControl('');


	ngOnChanges(changes: SimpleChanges): void {
		if (changes['icon_url']) {
			this.display_icon = this.icon_url ?? '';
		}
	}

	public onIconClick(): void {
		this.form_icon_url.setValue(this.icon_url);
		this.show_url_input = !this.show_url_input;
	}
}
