/* Core Dependencies */
import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
/* Application Modules */
import {OrcAppModule} from './app.module';

(async () => {
	// Load runtime config BEFORE bootstrap
	try {
		const res = await fetch('public/config.json', {cache: 'no-store'});
		if (!res.ok) throw new Error(`config fetch failed: ${res.status}`);
		const config = await res.json();
		(window as any).__config__ = config;
		if (config?.mode?.production) enableProdMode();
	} catch {}

	document.addEventListener('DOMContentLoaded', () => {
		platformBrowser()
			.bootstrapModule(OrcAppModule)
			.catch((err) => console.error(err));
	});
})();