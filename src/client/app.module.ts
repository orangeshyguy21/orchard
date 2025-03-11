/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'; 
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
/* Vendor Dependencies */
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideCharts } from 'ng2-charts';
import { 
	LineController,
	LinearScale,
	TimeScale,
	CategoryScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
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
		provideCharts({ 
			registerables: [
				LineController,
				LinearScale,
				TimeScale,
				CategoryScale,
				PointElement,
				LineElement,
				Tooltip,
				Filler,
				Legend
			]
		}),
    ],
    bootstrap: [
      	AppComponent
    ]
  })
  export class AppModule { }