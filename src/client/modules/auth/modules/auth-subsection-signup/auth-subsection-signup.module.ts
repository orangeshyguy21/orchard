/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
/* Native Dependencies */
import {OrcAuthGeneralModule} from '@client/modules/auth/modules/auth-general/auth-general.module';
/* Local Dependencies */
import {AuthSubsectionSignupComponent} from './components/auth-subsection-signup/auth-subsection-signup.component';
import {AuthSubsectionSignupFormComponent} from './components/auth-subsection-signup-form/auth-subsection-signup-form.component';

@NgModule({
	declarations: [AuthSubsectionSignupComponent, AuthSubsectionSignupFormComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: ':key',
				component: AuthSubsectionSignupComponent,
			},
			{
				path: '',
				component: AuthSubsectionSignupComponent,
			},
		]),
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		OrcFormModule,
		OrcGraphicModule,
		OrcAuthGeneralModule,
	],
})
export class OrcAuthSubsectionSignupModule {}
