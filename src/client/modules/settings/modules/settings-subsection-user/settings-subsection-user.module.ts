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
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcAuthGeneralModule} from '@client/modules/auth/modules/auth-general/auth-general.module';
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Native Module Dependencies */
import {SettingsSubsectionUserComponent} from './components/settings-subsection-user/settings-subsection-user.component';
import {SettingsSubsectionUserUserComponent} from './components/settings-subsection-user-user/settings-subsection-user-user.component';
import {SettingsSubsectionUserUserNameComponent} from './components/settings-subsection-user-user-name/settings-subsection-user-user-name.component';
import {SettingsSubsectionUserUserPasswordComponent} from './components/settings-subsection-user-user-password/settings-subsection-user-user-password.component';
import {SettingsSubsectionUserUserPasswordDialogComponent} from './components/settings-subsection-user-user-password-dialog/settings-subsection-user-user-password-dialog.component';

@NgModule({
	declarations: [
		SettingsSubsectionUserComponent,
		SettingsSubsectionUserUserComponent,
		SettingsSubsectionUserUserNameComponent,
		SettingsSubsectionUserUserPasswordComponent,
		SettingsSubsectionUserUserPasswordDialogComponent,
	],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: SettingsSubsectionUserComponent,
					canDeactivate: [pendingEventGuard],
				},
			]),
		],
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatChipsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		OrcFormModule,
		OrcLocalModule,
		OrcAuthGeneralModule,
	],
})
export class OrcSettingsSubsectionUserModule {}
