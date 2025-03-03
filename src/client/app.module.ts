/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'; 
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

/* Application Modules */
import { RoutingModule } from './modules/routing/routing.module';
/* Application Components */
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
      AppComponent,
    ],
    imports: [
        RouterOutlet,
        BrowserModule,
        RoutingModule
    ],
    providers: [
      provideHttpClient(),
      provideAnimations(),
    ],
    bootstrap: [
      AppComponent
    ]
  })
  export class AppModule { }