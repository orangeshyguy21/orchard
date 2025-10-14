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
/* Local Dependencies */
import {AuthSubsectionAuthenticateComponent} from './components/auth-subsection-authenticate/auth-subsection-authenticate.component';
import {AuthSubsectionAuthenticatePasswordComponent} from './components/auth-subsection-authenticate-password/auth-subsection-authenticate-password.component';

@NgModule({
	declarations: [AuthSubsectionAuthenticateComponent, AuthSubsectionAuthenticatePasswordComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: AuthSubsectionAuthenticateComponent,
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
	],
})
export class OrcAuthSubsectionAuthenticateModule {}
