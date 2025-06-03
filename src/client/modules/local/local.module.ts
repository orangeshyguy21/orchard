/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Native Module Dependencies */
import { TimePipe } from './pipes/time/time.pipe';
import { AmountPipe } from './pipes/amount/amount.pipe';
import { FeePipe } from './pipes/fee/fee.pipe';
import { UnitPipe } from './pipes/unit/unit.pipe';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';

@NgModule({
	declarations: [
		TimePipe,
		AmountPipe,
		FeePipe,
		UnitPipe,
		TruncatePipe
	],
	imports: [
		CommonModule,
	],
	exports: [
		TimePipe,
		AmountPipe,
		FeePipe,
		UnitPipe,
		TruncatePipe
	]
})
export class LocalModule { }