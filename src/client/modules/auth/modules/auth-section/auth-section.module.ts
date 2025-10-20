/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Native Dependencies */
import {initializationGuard} from '@client/modules/auth/guards/initialization/initialization.guard';
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
						canActivate: [initializationGuard],
						loadChildren: () =>
							import(
								'@client/modules/auth/modules/auth-subsection-authentication/auth-subsection-authentication.module'
							).then((m) => m.OrcAuthSubsectionAuthenticationModule),
						title: 'Orchard | Authentication',
						data: {
							section: 'auth',
							sub_section: 'authentication',
						},
					},
					{
						path: 'initialization',
						loadChildren: () =>
							import(
								'@client/modules/auth/modules/auth-subsection-initialization/auth-subsection-initialization.module'
							).then((m) => m.OrcAuthSubsectionInitializationModule),
						title: 'Orchard | Initialization',
						data: {
							section: 'auth',
							sub_section: 'initialization',
						},
					},
				],
			},
		]),
		CoreCommonModule,
	],
})
export class OrcAuthSectionModule {}
