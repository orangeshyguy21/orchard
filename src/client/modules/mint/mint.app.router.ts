/* Core Dependencies */
import {NgModule, inject} from '@angular/core';
import {RouterModule, Router, Routes, ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
/* Vendor Dependencies */
import {catchError, of} from 'rxjs';
/* Application Dependencies */
import {errorResolveGuard} from '@client/modules/error/guards/error-resolve.guard';
import {enabledGuard} from '@client/modules/routing/guards/enabled/enabled.guard';
import {ErrorService} from '@client/modules/error/services/error.service';
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Native Dependencies */
import {MintSectionComponent} from './components/mint-section/mint-section.component';
import {MintSubsectionErrorComponent} from './components/mint-subsection-error/mint-subsection-error.component';
import {MintSubsectionKeysetsComponent} from './components/mint-subsection-keysets/mint-subsection-keysets.component';
import {MintSubsectionDatabaseComponent} from './components/mint-subsection-database/mint-subsection-database.component';
import {MintSubsectionDisabledComponent} from './components/mint-subsection-disabled/mint-subsection-disabled.component';
import {MintService} from './services/mint/mint.service';
/* Shared Dependencies */
import {AiAgent} from '@shared/generated.types';

const mintInfoResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.loadMintInfo().pipe(
		catchError((error) => {
			errorService.resolve_errors.push(error);
			router.navigate(['mint', 'error'], {state: {error, target: state.url, sub_section: route.data['sub_section']}});
			return of([]);
		}),
	);
};

const mintBalancesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.loadMintBalances().pipe(
		catchError((error) => {
			errorService.resolve_errors.push(error);
			router.navigate(['mint', 'error'], {state: {error, target: state.url, sub_section: route.data['sub_section']}});
			return of([]);
		}),
	);
};

const mintKeysetsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.loadMintKeysets().pipe(
		catchError((error) => {
			errorService.resolve_errors.push(error);
			router.navigate(['mint', 'error'], {state: {error, target: state.url, sub_section: route.data['sub_section']}});
			return of([]);
		}),
	);
};

const mintInfoRpcResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.getMintInfo().pipe(
		catchError((error) => {
			errorService.resolve_errors.push(error);
			router.navigate(['mint', 'error'], {state: {error, target: state.url, sub_section: route.data['sub_section']}});
			return of([]);
		}),
	);
};

const mintQuoteTtlsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.getMintQuoteTtls().pipe(
		catchError((error) => {
			errorService.resolve_errors.push(error);
			router.navigate(['mint', 'error'], {state: {error, target: state.url, sub_section: route.data['sub_section']}});
			return of([]);
		}),
	);
};

const routes: Routes = [
	{
		path: '',
		component: MintSectionComponent,
		data: {
			section: 'mint',
		},
		children: [
			{
				path: '',
				loadChildren: () =>
					import('@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module').then(
						(m) => m.OrcMintSubsectionDashboardModule,
					),
				title: 'Orchard | Mint',
				resolve: {
					mint_info: mintInfoResolver,
					mint_balances: mintBalancesResolver,
					mint_keysets: mintKeysetsResolver,
				},
				canActivate: [enabledGuard],
				data: {
					section: 'mint',
					sub_section: 'dashboard',
					agent: AiAgent.MintDashboard,
				},
			},
			{
				path: 'info',
				loadChildren: () =>
					import('@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module').then(
						(m) => m.OrcMintSubsectionInfoModule,
					),
				title: 'Orchard | Mint Info',
				resolve: {
					mint_info_rpc: mintInfoRpcResolver,
				},
				canActivate: [enabledGuard],
				data: {
					section: 'mint',
					sub_section: 'info',
					agent: AiAgent.MintInfo,
				},
			},
			{
				path: 'config',
				loadChildren: () =>
					import('@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module').then(
						(m) => m.OrcMintSubsectionConfigModule,
					),
				title: 'Orchard | Mint Config',
				resolve: {
					mint_info: mintInfoResolver,
					mint_quote_ttl: mintQuoteTtlsResolver,
				},
				canActivate: [enabledGuard],
				data: {
					section: 'mint',
					sub_section: 'config',
					agent: AiAgent.MintConfig,
				},
			},
			{
				path: 'keysets',
				component: MintSubsectionKeysetsComponent,
				title: 'Orchard | Mint Keysets',
				resolve: {
					mint_keysets: mintKeysetsResolver,
				},
				canDeactivate: [pendingEventGuard],
				data: {
					section: 'mint',
					sub_section: 'keysets',
					agent: AiAgent.MintKeysets,
				},
			},
			{
				path: 'database',
				component: MintSubsectionDatabaseComponent,
				title: 'Orchard | Mint Database',
				resolve: {
					mint_keysets: mintKeysetsResolver,
				},
				canDeactivate: [pendingEventGuard],
				data: {
					section: 'mint',
					sub_section: 'database',
					agent: AiAgent.MintDatabase,
				},
			},
			{
				path: 'error',
				component: MintSubsectionErrorComponent,
				title: 'Orchard | Mint Error',
				data: {
					section: 'mint',
					sub_section: 'error',
				},
				canActivate: [errorResolveGuard],
				resolve: {
					origin: () => {
						const router = inject(Router);
						const navigation = router.currentNavigation();
						return navigation?.extras?.state?.['sub_section'] || 'unknown';
					},
				},
			},
		],
	},
	{
		path: 'disabled',
		component: MintSubsectionDisabledComponent,
		title: 'Orchard | Mint Disabled',
		data: {
			section: 'mint',
			sub_section: 'disabled',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MintAppRoutingModule {}
