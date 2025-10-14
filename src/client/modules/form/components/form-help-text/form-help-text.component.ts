/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-form-help-text',
	standalone: false,
	templateUrl: './form-help-text.component.html',
	styleUrl: './form-help-text.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormHelpTextComponent {}
