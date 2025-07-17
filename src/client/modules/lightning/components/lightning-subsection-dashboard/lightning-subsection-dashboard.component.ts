import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-lightning-subsection-dashboard',
	standalone: false,
	templateUrl: './lightning-subsection-dashboard.component.html',
	styleUrl: './lightning-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningSubsectionDashboardComponent {}
