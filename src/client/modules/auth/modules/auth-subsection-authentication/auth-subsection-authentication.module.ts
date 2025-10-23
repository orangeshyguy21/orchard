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
import {AuthSubsectionAuthenticationComponent} from './components/auth-subsection-authentication/auth-subsection-authentication.component';
import {AuthSubsectionAuthenticationFormComponent} from './components/auth-subsection-authentication-form/auth-subsection-authentication-form.component';

@NgModule({
	declarations: [AuthSubsectionAuthenticationComponent, AuthSubsectionAuthenticationFormComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: AuthSubsectionAuthenticationComponent,
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
export class OrcAuthSubsectionAuthenticationModule {}
