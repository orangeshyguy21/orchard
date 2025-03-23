/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
import { AiModule } from '@client/modules/ai/ai.module';
/* Local Dependencies */
import { LayoutExteriorComponent } from './components/layout-exterior/layout-exterior.component';
import { LayoutInteriorComponent } from './components/layout-interior/layout-interior.component';

const interior_routes = [
	{
		path: '',
		loadChildren: () => import('@client/modules/index/index.module').then(m => m.IndexModule),
	},
	{
		path: 'bitcoin',
		loadChildren: () => import('@client/modules/bitcoin/bitcoin.module').then(m => m.BitcoinModule),
	},
	{
		path: 'lightning',
		loadChildren: () => import('@client/modules/lightning/lightning.module').then(m => m.LightningModule),
	},
	{
		path: 'mint',
		loadChildren: () => import('@client/modules/mint/mint.module').then(m => m.MintModule),
	},
	{
		path: 'ecash',
		loadChildren: () => import('@client/modules/ecash/ecash.module').then(m => m.EcashModule),
	},
	{
		path: 'settings',
		loadChildren: () => import('@client/modules/settings/settings.module').then(m => m.SettingsModule),
	},
	{
		path: 'event',
		loadChildren: () => import('@client/modules/event/event.module').then(m => m.EventModule),
	}
]

const routes: Routes = [
	{
		path: '',
		component: LayoutInteriorComponent,
		children: interior_routes,
	},
	{
		path: 'login',
		component: LayoutExteriorComponent,
		loadChildren: () => import('@client/modules/login/login.module').then(m => m.LoginModule)
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
		NavModule,
		AiModule,
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