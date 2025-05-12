/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-help-text',
	standalone: false,
	templateUrl: './help-text.component.html',
	styleUrl: './help-text.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpTextComponent {

	@Input() on: string = 'standard-help-text';

}
