/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {LightningSubsectionDashboardComponent} from './components/lightning-subsection-dashboard/lightning-subsection-dashboard.component';

@NgModule({
	declarations: [LightningSubsectionDashboardComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: LightningSubsectionDashboardComponent,
			},
		]),
		MatIconModule,
	],
	exports: [],
})
export class OrcLightningSubsectionDashboardModule {}
