/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Local Dependencies */
import { MintNavComponent } from './components/mint-nav/mint-nav.component';
import { MintSectionComponent } from './components/mint-section/mint-section.component';
import { MintSubsectionDashboardComponent } from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import { MintSubsectionInfoComponent } from './components/mint-subsection-info/mint-subsection-info.component';

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
				path: 'info',
				component: MintSubsectionInfoComponent,
				title: 'Orchard | Mint Info',
				data: {
					section: 'mint',
					sub_section: 'info'
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
		MintSubsectionInfoComponent,
	],
	imports: [
		CommonModule,
		MintRoutingModule,
		MatIconModule,
		MatButtonModule,
		NavModule,
	],
})
export class MintModule { }