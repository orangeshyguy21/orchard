/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-form-toggle-group',
	standalone: false,
	templateUrl: './form-toggle-group.component.html',
	styleUrl: './form-toggle-group.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormToggleGroupComponent {}
