/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
/* Vendor Dependencies */
import {MatSidenavModule} from '@angular/material/sidenav';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {AiModule} from '@client/modules/ai/ai.module';
import {EventModule} from '@client/modules/event/event.module';
/* Native Dependencies */
import {LayoutExteriorComponent} from './components/layout-exterior/layout-exterior.component';
import {LayoutInteriorComponent} from './components/layout-interior/layout-interior.component';
import {authenticationGuard} from './guards/authentication/authentication.guard';

const interior_routes = [
	{
		path: '',
		loadChildren: () => import('@client/modules/index/index.app.module').then((m) => m.IndexAppModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'bitcoin',
		loadChildren: () => import('@client/modules/bitcoin/bitcoin.app.module').then((m) => m.BitcoinAppModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'lightning',
		loadChildren: () => import('@client/modules/lightning/lightning.app.module').then((m) => m.LightningAppModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'mint',
		loadChildren: () => import('@client/modules/mint/mint.app.module').then((m) => m.MintAppModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'ecash',
		loadChildren: () => import('@client/modules/ecash/ecash.app.module').then((m) => m.EcashAppModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'settings',
		loadChildren: () => import('@client/modules/settings/settings.app.module').then((m) => m.SettingsAppModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'event',
		loadChildren: () => import('@client/modules/event/event.app.module').then((m) => m.EventAppModule),
		canActivateChild: [authenticationGuard],
	},
];

const routes: Routes = [
	{
		path: '',
		component: LayoutInteriorComponent,
		canActivate: [authenticationGuard],
		canActivateChild: [authenticationGuard],
		children: interior_routes,
	},
	{
		path: 'authentication',
		component: LayoutExteriorComponent,
		loadChildren: () => import('@client/modules/auth/auth-app.module').then((m) => m.AuthAppModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes), MatSidenavModule, OrcNavModule, AiModule, EventModule],
	exports: [RouterModule],
	declarations: [LayoutExteriorComponent, LayoutInteriorComponent],
})
export class RoutingModule {}
