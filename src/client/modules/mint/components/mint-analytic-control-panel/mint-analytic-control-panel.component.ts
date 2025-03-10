/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { enUS } from 'date-fns/locale';

@Component({
	selector: 'orc-mint-analytic-control-panel',
	standalone: false,
	templateUrl: './mint-analytic-control-panel.component.html',
	styleUrl: './mint-analytic-control-panel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintAnalyticControlPanelComponent {

	constructor() {
		// console.log('enUS', enUS);
	}


	readonly range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	});

}
