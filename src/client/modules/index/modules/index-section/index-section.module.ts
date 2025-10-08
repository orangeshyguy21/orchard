/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {IndexSectionComponent} from './components/index-section/index-section.component';

@NgModule({
	declarations: [IndexSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: IndexSectionComponent,
				data: {
					section: 'index',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module').then(
								(m) => m.OrcIndexSubsectionDashboardModule,
							),
						title: 'Orchard',
						data: {
							section: 'index',
							sub_section: 'dashboard',
						},
					},
				],
			},
		]),
		CoreCommonModule,
		OrcNavModule,
	],
})
export class OrcIndexSectionModule {}
