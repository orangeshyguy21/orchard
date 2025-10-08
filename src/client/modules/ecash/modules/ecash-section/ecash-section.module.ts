/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Local Dependencies */
import {EcashSectionComponent} from './components/ecash-section/ecash-section.component';

@NgModule({
	declarations: [EcashSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: EcashSectionComponent,
				data: {
					section: 'ecash',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/ecash/modules/ecash-subsection-dashboard/ecash-subsection-dashboard.module').then(
								(m) => m.OrcEcashSubsectionDashboardModule,
							),
						title: 'Orchard | Ecash',
						data: {
							section: 'ecash',
							sub_section: 'dashboard',
						},
					},
				],
			},
		]),
		CoreCommonModule,
	],
})
export class EcashSectionModule {}
