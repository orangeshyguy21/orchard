/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatChipsModule} from '@angular/material/chips';
/* Application Dependencies */

/* Native Module Dependencies */
import {SettingsSubsectionUserComponent} from './components/settings-subsection-user/settings-subsection-user.component';

@NgModule({
	declarations: [SettingsSubsectionUserComponent],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: SettingsSubsectionUserComponent,
				},
			]),
		],
		CoreCommonModule,
		MatChipsModule,
	],
})
export class OrcSettingsSubsectionUserModule {}
