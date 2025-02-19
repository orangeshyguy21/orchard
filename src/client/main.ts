/* Core Dependencies */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
/* Application Modules */
import { AppModule } from './app.module';
/* Application Configuration */
import { environment } from './configs/configuration';

if( environment.mode.production ){
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});