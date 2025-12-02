/* Core Dependencies */
import {enableProdMode, provideZoneChangeDetection} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
/* Application Modules */
import {OrcAppModule} from './app.module';

(async () => {
	try {
		const res = await fetch('config.json', {cache: 'no-store'});
		if (!res.ok) throw new Error(`config fetch failed: ${res.status}`);
		const config = await res.json();
		(window as any).__config__ = config;
		if (config?.mode?.production) enableProdMode();
	} catch (error) {
		console.error('Failed to load runtime config:', error);
	}

	platformBrowser()
		.bootstrapModule(OrcAppModule, {applicationProviders: [provideZoneChangeDetection()]})
		.catch((err) => console.error(err));
})();
