/* Core Dependencies */
import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
/* Application Modules */
import {OrcAppModule} from './app.module';
/* Application Configuration */
import {environment} from './configs/configuration';

if (environment.mode.production) enableProdMode();

document.addEventListener('DOMContentLoaded', () => {
	platformBrowser()
		.bootstrapModule(OrcAppModule)
		.catch((err) => console.error(err));
});
