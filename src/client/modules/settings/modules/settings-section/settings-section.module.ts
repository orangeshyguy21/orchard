/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {SettingsSectionComponent} from './components/settings-section/settings-section.component';

@NgModule({
	declarations: [SettingsSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: SettingsSectionComponent,
				data: {
					section: 'event',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import(
								'@client/modules/settings/modules/settings-subsection-dashboard/settings-subsection-dashboard.module'
							).then((m) => m.OrcSettingsSubsectionDashboardModule),
						title: 'Orchard | Settings',
						data: {
							section: 'event',
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
export class OrcSettingsSectionModule {}
