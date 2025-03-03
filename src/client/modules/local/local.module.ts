/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Native Module Dependencies */
import { TimePipe } from './pipes/time/time.pipe';

@NgModule({
	declarations: [
		TimePipe
	],
	imports: [
		CommonModule,
	],
	exports: [
		TimePipe
	]
})
export class LocalModule { }