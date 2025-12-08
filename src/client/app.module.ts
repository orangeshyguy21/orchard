/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterOutlet as CoreRouterOutlet} from '@angular/router';
import {BrowserModule as CoreBrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {provideCharts} from 'ng2-charts';
import {
	LineController,
	BarController,
	LinearScale,
	TimeSeriesScale,
	CategoryScale,
	PointElement,
	LineElement,
	BarElement,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
/* Application Dependencies */
import {OrcRoutingModule} from './modules/routing/routing.module';
import {authInterceptor} from './modules/auth/interceptors/auth.interceptor';
import {errorInterceptor} from './modules/error/interceptors/error.interceptor';
/* Native Dependencies */
import {AppComponent} from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [CoreRouterOutlet, CoreBrowserModule, MatProgressSpinnerModule, OrcRoutingModule],
	providers: [
		provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
		provideLuxonDateAdapter(),
		provideCharts({
			registerables: [
				LineController,
				BarController,
				LinearScale,
				TimeSeriesScale,
				CategoryScale,
				PointElement,
				LineElement,
				BarElement,
				Tooltip,
				Filler,
				Legend,
			],
		}),
	],
	bootstrap: [AppComponent],
})
export class OrcAppModule {}
