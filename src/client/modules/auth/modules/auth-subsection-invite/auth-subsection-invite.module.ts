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
import {AuthSubsectionInviteComponent} from './components/auth-subsection-invite/auth-subsection-invite.component';
import {AuthSubsectionInviteFormComponent} from './components/auth-subsection-invite-form/auth-subsection-invite-form.component';

@NgModule({
	declarations: [AuthSubsectionInviteComponent, AuthSubsectionInviteFormComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: ':key',
				component: AuthSubsectionInviteComponent,
			},
			{
				path: '',
				component: AuthSubsectionInviteComponent,
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
export class OrcAuthSubsectionInviteModule {}
