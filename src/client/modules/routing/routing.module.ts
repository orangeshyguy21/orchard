/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
/* Vendor Dependencies */
import {MatSidenavModule} from '@angular/material/sidenav';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcAiModule} from '@client/modules/ai/ai.module';
import {OrcEventGeneralModule} from '@client/modules/event/modules/event-general/event-general.module';
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
		loadChildren: () =>
			import('@client/modules/bitcoin/modules/bitcoin-section/bitcoin-section.module').then((m) => m.BitcoinSectionModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'lightning',
		loadChildren: () =>
			import('@client/modules/lightning/modules/lightning-section/lightning-section.module').then((m) => m.OrcLightningSectionModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'mint',
		loadChildren: () => import('@client/modules/mint/modules/mint-section/mint-section.module').then((m) => m.OrcMintSectionModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'ecash',
		loadChildren: () => import('@client/modules/ecash/modules/ecash-section/ecash-section.module').then((m) => m.EcashSectionModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'settings',
		loadChildren: () =>
			import('@client/modules/settings/modules/settings-section/settings-section.module').then((m) => m.OrcSettingsSectionModule),
		canActivateChild: [authenticationGuard],
	},
	{
		path: 'event',
		loadChildren: () => import('@client/modules/event/modules/event-section/event-section.module').then((m) => m.OrcEventSectionModule),
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
		loadChildren: () => import('@client/modules/auth/modules/auth-section/auth-section.module').then((m) => m.AuthSectionModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes), MatSidenavModule, OrcNavModule, OrcAiModule, OrcEventGeneralModule],
	exports: [RouterModule],
	declarations: [LayoutExteriorComponent, LayoutInteriorComponent],
})
export class RoutingModule {}
