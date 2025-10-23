/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Native Module Dependencies */
import {LocalAmountPipe} from './pipes/local-amount/local-amount.pipe';
import {LocalTimePipe} from './pipes/local-time/local-time.pipe';
import {LocalTimeAgoPipe} from './pipes/local-time-ago/local-time-ago.pipe';
import {LocalTimeDeltaPipe} from './pipes/local-time-delta/local-time-delta.pipe';
import {LocalUnitPipe} from './pipes/local-unit/local-unit.pipe';

@NgModule({
	declarations: [LocalTimePipe, LocalAmountPipe, LocalTimeDeltaPipe, LocalTimeAgoPipe, LocalUnitPipe],
	imports: [CommonModule],
	exports: [LocalTimePipe, LocalAmountPipe, LocalTimeDeltaPipe, LocalTimeAgoPipe, LocalUnitPipe],
})
export class OrcLocalModule {}
