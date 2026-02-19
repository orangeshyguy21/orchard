/* Core Dependencies */
import {LOCALE_ID, NgModule, inject, provideAppInitializer} from '@angular/core';
import {RouterOutlet as CoreRouterOutlet} from '@angular/router';
import {BrowserModule as CoreBrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
/* Vendor Dependencies */
import {firstValueFrom, catchError, of} from 'rxjs';
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
import {SettingAppService} from './modules/settings/services/setting-app/setting-app.service';
/* Native Dependencies */
import {AppComponent} from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [CoreRouterOutlet, CoreBrowserModule, MatProgressSpinnerModule, OrcRoutingModule],
	providers: [
		{
			provide: LOCALE_ID,
			useFactory: () => {
				try {
					const item = localStorage.getItem('v0.setting.locale');
					if (item) {
						const locale = JSON.parse(item);
						if (locale?.code) return locale.code;
					}
				} catch {}
				return Intl.DateTimeFormat().resolvedOptions().locale;
			},
		},
		provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
		provideLuxonDateAdapter(),
		provideAppInitializer(() => {
			const settingAppService = inject(SettingAppService);
			return firstValueFrom(settingAppService.loadSettings().pipe(catchError(() => of(null))));
		}),
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
