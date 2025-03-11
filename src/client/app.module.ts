/* Core Dependencies */
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'; 
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
/* Vendor Dependencies */
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideCharts } from 'ng2-charts';
import { 
	LineController,
	LinearScale,
	TimeSeriesScale,
	CategoryScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js';
import 'chartjs-adapter-luxon';
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
		provideLuxonDateAdapter(),
		provideCharts({ 
			registerables: [
				LineController,
				LinearScale,
				TimeSeriesScale,
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