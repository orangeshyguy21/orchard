import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'orc-bitcoin-subsection-dashboard',
	standalone: false,
	templateUrl: './bitcoin-subsection-dashboard.component.html',
	styleUrl: './bitcoin-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionDashboardComponent {}
