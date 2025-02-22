/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { MintNavComponent } from './components/mint-nav/mint-nav.component';
import { MintSectionComponent } from './components/mint-section/mint-section.component';
import { MintSubsectionDashboardComponent } from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import { MintSubsectionConfigComponent } from './components/mint-subsection-config/mint-subsection-config.component';

const routes: Routes = [
	{
		path: '',
		component: MintSectionComponent,
		children: [
			{
				path: '',
				component: MintSubsectionDashboardComponent,
				title: 'Orchard | Mint',
				data: {
					section: 'mint',
					sub_section: 'dashboard'
				}
			},
			{
				path: 'configuration',
				component: MintSubsectionConfigComponent,
				title: 'Orchard | Mint Configuration',
				data: {
					section: 'mint',
					sub_section: 'configuration'
				}
			},
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
})
export class MintRoutingModule { }


@NgModule({
	declarations: [
		MintNavComponent,
		MintSectionComponent,
		MintSubsectionDashboardComponent,
		MintSubsectionConfigComponent,
	],
	imports: [
		CommonModule,
		MintRoutingModule,
		MatIconModule,
		MatButtonModule,
	],
})
export class MintModule { }