/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
/* Local Dependencies */
import { EventNavToolComponent } from './components/event-nav-tool/event-nav-tool.component';

@NgModule({
	declarations: [
		EventNavToolComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatProgressSpinnerModule,
	],
	exports: [
		EventNavToolComponent
	]
})
export class EventModule { }