/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'orc-mint-keyset-rotation',
	standalone: false,
	templateUrl: './mint-keyset-rotation.component.html',
	styleUrl: './mint-keyset-rotation.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetRotationComponent {

	@Input() form_group!: FormGroup;
	@Input() unit_options!: { value: string, label: string }[];

	public onSubmit(event: Event): void {
		console.log(event);
	}

}
