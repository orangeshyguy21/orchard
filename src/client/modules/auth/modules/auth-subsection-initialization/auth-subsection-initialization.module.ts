/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcCrewModule} from '@client/modules/crew/crew.module';
/* Native Dependencies */
import {OrcAuthGeneralModule} from '@client/modules/auth/modules/auth-general/auth-general.module';
/* Local Dependencies */
import {AuthSubsectionInitializationComponent} from './components/auth-subsection-initialization/auth-subsection-initialization.component';
import {AuthSubsectionInitializationFormComponent} from './components/auth-subsection-initialization-form/auth-subsection-initialization-form.component';

@NgModule({
	declarations: [AuthSubsectionInitializationComponent, AuthSubsectionInitializationFormComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: AuthSubsectionInitializationComponent,
			},
		]),
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		OrcFormModule,
		OrcGraphicModule,
		OrcCrewModule,
		OrcAuthGeneralModule,
	],
})
export class OrcAuthSubsectionInitializationModule {}
