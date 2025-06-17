/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Application Dependencies */
import { enabledGuard } from '@client/modules/routing/guards/enabled/enabled.guard';
/* Native Dependencies */
import { LightningSectionComponent } from './components/lightning-section/lightning-section.component';
import { LightningSubsectionDashboardComponent } from './components/lightning-subsection-dashboard/lightning-subsection-dashboard.component';
import { LightningSubsectionDisabledComponent } from './components/lightning-subsection-disabled/lightning-subsection-disabled.component';

const routes: Routes = [
	{
		path: '',
		component: LightningSectionComponent,
		data: {
			section: 'lightning',
		},
		children: [
			{
				path: '',
				component: LightningSubsectionDashboardComponent,
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
		component: LightningSubsectionDisabledComponent,
		title: 'Orchard | Lightning Disabled',
		data: {
			section: 'lightning',
			sub_section: 'disabled',
		},
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
})
export class LightningAppRoutingModule { }