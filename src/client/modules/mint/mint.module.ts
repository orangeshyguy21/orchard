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
import { MintLayoutComponent } from './components/mint-layout/mint-layout.component';
import { MintConfigComponent } from './components/mint-config/mint-config.component';

const routes: Routes = [
	{
		path: '',
		component: MintLayoutComponent,
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
	declarations: [
		MintNavComponent,
		MintLayoutComponent,
  MintConfigComponent
	]
})
export class MintRoutingModule { }


@NgModule({
	declarations: [
		MintComponent
	],
	imports: [
		CommonModule,
		MintRoutingModule,
		MatIconModule,
		MatButtonModule,
	],
})
export class MintModule { }