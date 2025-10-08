import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-ecash-subsection-dashboard',
	standalone: false,
	templateUrl: './ecash-subsection-dashboard.component.html',
	styleUrl: './ecash-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcashSubsectionDashboardComponent {}
