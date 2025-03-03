/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Native Module Dependencies */
import { TimePipe } from './pipes/time/time.pipe';
import { AmountPipe } from './pipes/amount/amount.pipe';

@NgModule({
	declarations: [
		TimePipe,
		AmountPipe
	],
	imports: [
		CommonModule,
	],
	exports: [
		TimePipe,
		AmountPipe
	]
})
export class LocalModule { }