/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Local Dependencies */
import {AuthSectionComponent} from './components/auth-section/auth-section.component';

@NgModule({
	declarations: [AuthSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: AuthSectionComponent,
				data: {
					section: 'auth',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/auth/modules/auth-subsection-authenticate/auth-subsection-authenticate.module').then(
								(m) => m.OrcAuthSubsectionAuthenticateModule,
							),
						title: 'Orchard | Auth',
						data: {
							section: 'auth',
							sub_section: 'authentication',
						},
					},
				],
			},
		]),
		CoreCommonModule,
	],
})
export class OrcAuthSectionModule {}
