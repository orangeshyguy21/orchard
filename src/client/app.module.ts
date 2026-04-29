/* Core Dependencies */
import {LOCALE_ID, NgModule, inject, provideAppInitializer} from '@angular/core';
import {RouterOutlet as CoreRouterOutlet} from '@angular/router';
import {BrowserModule as CoreBrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeBn from '@angular/common/locales/bn';
import localeDa from '@angular/common/locales/da';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeFi from '@angular/common/locales/fi';
import localeFr from '@angular/common/locales/fr';
import localeHe from '@angular/common/locales/he';
import localeHi from '@angular/common/locales/hi';
import localeId from '@angular/common/locales/id';
import localeIt from '@angular/common/locales/it';
import localeJa from '@angular/common/locales/ja';
import localeKo from '@angular/common/locales/ko';
import localeNl from '@angular/common/locales/nl';
import localeNo from '@angular/common/locales/no';
import localePl from '@angular/common/locales/pl';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeSv from '@angular/common/locales/sv';
import localeTh from '@angular/common/locales/th';
import localeTr from '@angular/common/locales/tr';
import localeVi from '@angular/common/locales/vi';
import localeZh from '@angular/common/locales/zh';
/* Vendor Dependencies */
import {firstValueFrom, catchError, of} from 'rxjs';
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
/* Application Dependencies */
import {OrcRoutingModule} from './modules/routing/routing.module';
import {authInterceptor} from './modules/auth/interceptors/auth.interceptor';
import {errorInterceptor} from './modules/error/interceptors/error.interceptor';
import {SettingAppService} from './modules/settings/services/setting-app/setting-app.service';
/* Native Dependencies */
import {AppComponent} from './app.component';

for (const data of [
	localeAr, localeBn, localeDa, localeDe, localeEs, localeFi, localeFr,
	localeHe, localeHi, localeId, localeIt, localeJa, localeKo, localeNl,
	localeNo, localePl, localePt, localeRu, localeSv, localeTh, localeTr,
	localeVi, localeZh,
]) {
	registerLocaleData(data);
}

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
	],
	bootstrap: [AppComponent],
})
export class OrcAppModule {}
