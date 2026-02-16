/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-ecash-general-note',
	standalone: false,
	templateUrl: './ecash-general-note.component.html',
	styleUrl: './ecash-general-note.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcashGeneralNoteComponent {
	public amount = input.required<number>();
	public unit = input.required<string>();
	public quantity = input<number>();
}
