/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
/* Native Module Dependencies */
import {SettingsSubsectionUserComponent} from './components/settings-subsection-user/settings-subsection-user.component';
import {SettingsSubsectionUserUserComponent} from './components/settings-subsection-user-user/settings-subsection-user-user.component';
import {SettingsSubsectionUserUserNameComponent} from './components/settings-subsection-user-user-name/settings-subsection-user-user-name.component';

@NgModule({
	declarations: [SettingsSubsectionUserComponent, SettingsSubsectionUserUserComponent, SettingsSubsectionUserUserNameComponent],
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
		CoreReactiveFormsModule,
		MatChipsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		OrcFormModule,
	],
})
export class OrcSettingsSubsectionUserModule {}
