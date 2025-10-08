/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {EcashSubsectionDashboardComponent} from './components/ecash-subsection-dashboard/ecash-subsection-dashboard.component';

@NgModule({
	declarations: [EcashSubsectionDashboardComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: EcashSubsectionDashboardComponent,
			},
		]),
		MatIconModule,
	],
	exports: [],
})
export class OrcEcashSubsectionDashboardModule {}
