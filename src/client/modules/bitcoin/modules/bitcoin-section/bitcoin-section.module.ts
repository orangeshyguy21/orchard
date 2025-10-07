/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {enabledGuard} from '@client/modules/routing/guards/enabled/enabled.guard';
/* Native Dependencies */
import {BitcoinSectionComponent} from './components/bitcoin-section/bitcoin-section.component';

@NgModule({
	declarations: [BitcoinSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: BitcoinSectionComponent,
				data: {
					section: 'bitcoin',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/bitcoin/modules/bitcoin-subsection-dashboard/bitcoin-subsection-dashboard.module').then(
								(m) => m.OrcBitcoinSubsectionDashboardModule,
							),
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
				loadChildren: () =>
					import('@client/modules/bitcoin/modules/bitcoin-subsection-disabled/bitcoin-subsection-disabled.module').then(
						(m) => m.OrcBitcoinSubsectionDisabledModule,
					),
				title: 'Orchard | Bitcoin Disabled',
				data: {
					section: 'bitcoin',
					sub_section: 'disabled',
				},
			},
		]),
		CoreCommonModule,
		MatIconModule,
		OrcNavModule,
	],
})
export class BitcoinSectionModule {}
