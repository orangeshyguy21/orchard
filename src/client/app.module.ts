/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'; 
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
/* Vendor Dependencies */
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
/* Application Dependencies */
import { RoutingModule } from './modules/routing/routing.module';
/* Native Dependencies */
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
      provideDateFnsAdapter(),
    ],
    bootstrap: [
      AppComponent
    ]
  })
  export class AppModule { }