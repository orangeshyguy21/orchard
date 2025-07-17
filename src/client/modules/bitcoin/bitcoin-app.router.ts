/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
/* Application Dependencies */
import {enabledGuard} from '@client/modules/routing/guards/enabled/enabled.guard';
/* Native Dependencies */
import {BitcoinSectionComponent} from './components/bitcoin-section/bitcoin-section.component';
import {BitcoinSubsectionDashboardComponent} from './components/bitcoin-subsection-dashboard/bitcoin-subsection-dashboard.component';
import {BitcoinSubsectionDisabledComponent} from './components/bitcoin-subsection-disabled/bitcoin-subsection-disabled.component';

const routes: Routes = [
	{
		path: '',
		component: BitcoinSectionComponent,
		data: {
			section: 'bitcoin',
		},
		children: [
			{
				path: '',
				component: BitcoinSubsectionDashboardComponent,
				title: 'Orchard | Bitcoin',
				canActivate: [enabledGuard],
				data: {
					section: 'bitcoin',
					sub_section: 'dashboard',
				},
			},
		],
	},
	{
		path: 'disabled',
		component: BitcoinSubsectionDisabledComponent,
		title: 'Orchard | Bitcoin Disabled',
		data: {
			section: 'bitcoin',
			sub_section: 'disabled',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BitcoinAppRoutingModule {}
