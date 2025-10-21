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
					section: 'settings',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module').then(
								(m) => m.OrcSettingsSubsectionDeviceModule,
							),
						title: 'Orchard | Device Settings',
						data: {
							section: 'settings',
							sub_section: 'device',
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
