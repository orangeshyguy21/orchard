/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcSettingsModule} from '@client/modules/settings/settings.module';
import {enabledGuard} from '@client/modules/routing/guards/enabled/enabled.guard';
/* Native Dependencies */
import {BitcoinSectionComponent} from './components/bitcoin-section/bitcoin-section.component';
import {BitcoinSubsectionDisabledComponent} from './components/bitcoin-subsection-disabled/bitcoin-subsection-disabled.component';

@NgModule({
	declarations: [BitcoinSectionComponent, BitcoinSubsectionDisabledComponent],
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
				component: BitcoinSubsectionDisabledComponent,
				title: 'Orchard | Bitcoin Disabled',
				data: {
					section: 'bitcoin',
					sub_section: 'disabled',
				},
			},
		]),
		CoreCommonModule,
		MatIconModule,
		MatButtonModule,
		OrcNavModule,
		OrcSettingsModule,
	],
})
export class BitcoinAppModule {}
