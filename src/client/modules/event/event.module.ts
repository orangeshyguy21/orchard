/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
/* Native Dependencies */
import { EventSnackbarComponent } from './components/event-snackbar/event-snackbar.component';

@NgModule({
	declarations: [
		EventSnackbarComponent
	],
	imports: [
		CommonModule,
		MatIconModule
	],
	exports: [
		EventSnackbarComponent
	]
})
export class EventModule { }