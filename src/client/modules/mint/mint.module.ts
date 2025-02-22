/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
/* Local Dependencies */
import { MintComponent } from './components/mint/mint.component';
import { MintNavComponent } from './components/mint-nav/mint-nav.component';
import { MintSectionComponent } from './components/mint-section/mint-section.component';
import { MintConfigComponent } from './components/mint-config/mint-config.component';

const routes: Routes = [
	{
		path: '',
		component: MintSectionComponent,
		children: [
			{
				path: '',
				component: MintComponent,
				title: 'Orchard | Mint',
				data: {
					section: 'mint',
					sub_section: 'dashboard'
				}
			},
			{
				path: 'configuration',
				component: MintConfigComponent,
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
		MintComponent,
		MintNavComponent,
		MintSectionComponent,
		MintConfigComponent
	],
	imports: [
		CommonModule,
		MintRoutingModule,
		MatIconModule,
		MatButtonModule,
	],
})
export class MintModule { }