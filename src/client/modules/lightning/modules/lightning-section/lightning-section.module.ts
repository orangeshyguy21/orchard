/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {enabledGuard} from '@client/modules/routing/guards/enabled/enabled.guard';
/* Native Dependencies */
import {LightningSectionComponent} from './components/lightning-section/lightning-section.component';

@NgModule({
	declarations: [LightningSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: LightningSectionComponent,
				data: {
					section: 'lightning',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/lightning/modules/lightning-subsection-dashboard/lightning-subsection-dashboard.module').then(
								(m) => m.OrcLightningSubsectionDashboardModule,
							),
						title: 'Orchard | Lightning',
						canActivate: [enabledGuard],
						data: {
							section: 'lightning',
							sub_section: 'dashboard',
						},
					},
				],
			},
			{
				path: 'disabled',
				loadChildren: () =>
					import('@client/modules/lightning/modules/lightning-subsection-disabled/lightning-subsection-disabled.module').then(
						(m) => m.OrcLightningSubsectionDisabledModule,
					),
				title: 'Orchard | Lightning Disabled',
				data: {
					section: 'lightning',
					sub_section: 'disabled',
				},
			},
		]),
		CoreCommonModule,
		MatIconModule,
		OrcNavModule,
	],
})
export class OrcLightningSectionModule {}

// /* Core Dependencies */
// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// /* Application Dependencies */
// import {enabledGuard} from '@client/modules/routing/guards/enabled/enabled.guard';
// /* Native Dependencies */
// import {LightningSectionComponent} from './components/lightning-section/lightning-section.component';
// import {LightningSubsectionDashboardComponent} from './components/lightning-subsection-dashboard/lightning-subsection-dashboard.component';
// import {LightningSubsectionDisabledComponent} from './components/lightning-subsection-disabled/lightning-subsection-disabled.component';

// const routes: Routes = [
// 	{
// 		path: '',
// 		component: LightningSectionComponent,
// 		data: {
// 			section: 'lightning',
// 		},
// 		children: [
// 			{
// 				path: '',
// 				component: LightningSubsectionDashboardComponent,
// 				title: 'Orchard | Lightning',
// 				canActivate: [enabledGuard],
// 				data: {
// 					section: 'lightning',
// 					sub_section: 'dashboard',
// 				},
// 			},
// 		],
// 	},
// 	{
// 		path: 'disabled',
// 		component: LightningSubsectionDisabledComponent,
// 		title: 'Orchard | Lightning Disabled',
// 		data: {
// 			section: 'lightning',
// 			sub_section: 'disabled',
// 		},
// 	},
// ];

// @NgModule({
// 	imports: [RouterModule.forChild(routes)],
// 	exports: [RouterModule],
// })
// export class LightningAppRoutingModule {}
