/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */

/* Local Dependencies */
import {BitcoinSubsectionDashboardComponent} from './components/bitcoin-subsection-dashboard/bitcoin-subsection-dashboard.component';

@NgModule({
	declarations: [BitcoinSubsectionDashboardComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: BitcoinSubsectionDashboardComponent,
			},
		]),
		MatIconModule,
	],
	exports: [],
})
export class OrcBitcoinSubsectionDashboardModule {}
