/* Core Dependencies */
import { NgModule, inject } from '@angular/core';
import { RouterModule, Router, Routes, ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/* Vendor Dependencies */
import { catchError, of } from 'rxjs';
/* Application Dependencies */
import { errorResolveGuard } from '../error/guards/error-resolve.guard';
import { ErrorService } from '../error/services/error.service';
/* Native Dependencies */
import { MintSectionComponent } from './components/mint-section/mint-section.component';
import { MintSubsectionErrorComponent } from './components/mint-subsection-error/mint-subsection-error.component';
import { MintSubsectionDashboardComponent } from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import { MintSubsectionInfoComponent } from './components/mint-subsection-info/mint-subsection-info.component';
import { MintSubsectionConfigComponent } from './components/mint-subsection-config/mint-subsection-config.component';
import { MintService } from './services/mint/mint.service';

const mintInfoResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.loadMintInfo().pipe(
		catchError(error => {
			errorService.resolve_errors.push(error);
            router.navigate(['mint', 'error'], { state: { error, target: state.url } });
            return of([]);
		})
	);
};
	
const mintBalancesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.loadMintBalances().pipe(
		catchError(error => {
			errorService.resolve_errors.push(error);
            router.navigate(['mint', 'error'], { state: { error, target: state.url } });
            return of([]);
		})
	);
};

const mintKeysetsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const mintService = inject(MintService);
	const router = inject(Router);
	const errorService = inject(ErrorService);
	return mintService.loadMintKeysets().pipe(
		catchError(error => {
			errorService.resolve_errors.push(error);
			router.navigate(['mint', 'error'], { state: { error, target: state.url } });
            return of([]);
		})
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
				component: MintSubsectionDashboardComponent,
				title: 'Orchard | Mint',
				resolve: {
					mint_info: mintInfoResolver,
					mint_balances: mintBalancesResolver,
					mint_keysets: mintKeysetsResolver
				},
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
			{
				path: 'config',
				component: MintSubsectionConfigComponent,
				title: 'Orchard | Mint Config',
				data: {
					section: 'mint',
					sub_section: 'config'
				}
			},
			{
				path: 'error',
				component: MintSubsectionErrorComponent,
				title: 'Orchard | Mint Error',
				data: {
					section: 'mint',
					sub_section: 'error',
				},
				canActivate: [errorResolveGuard]
			},
		]
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
export class MintRoutingModule { }