/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
/* Local Dependencies */
import { LayoutExteriorComponent } from './components/layout-exterior/layout-exterior.component';
import { LayoutInteriorComponent } from './components/layout-interior/layout-interior.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutInteriorComponent,
		children: [
			{
				path: '',
				loadChildren: () => import('../index/index.module').then(m => m.IndexModule),
			},
			{
				path: 'bitcoin',
				loadChildren: () => import('../bitcoin/bitcoin.module').then(m => m.BitcoinModule),
			},
			{
				path: 'lightning',
				loadChildren: () => import('../lightning/lightning.module').then(m => m.LightningModule),
			},
			{
				path: 'mint',
				loadChildren: () => import('../mint/mint.module').then(m => m.MintModule),
			},
			{
				path: 'ecash',
				loadChildren: () => import('../ecash/ecash.module').then(m => m.EcashModule),
			},
			{
				path: 'settings',
				loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
			}
		]
	},
	{
		path: 'login',
		component: LayoutExteriorComponent,
		loadChildren: () => import('../login/login.module').then(m => m.LoginModule)
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
		NavModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		LayoutExteriorComponent,
		LayoutInteriorComponent
	]
})
export class RoutingModule { }