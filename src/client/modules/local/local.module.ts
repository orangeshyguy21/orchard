/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Native Module Dependencies */
import {TimePipe} from './pipes/time/time.pipe';
import {AmountPipe} from './pipes/amount/amount.pipe';
import {UnitPipe} from './pipes/unit/unit.pipe';
import {TruncatePipe} from './pipes/truncate/truncate.pipe';
import {TimeDeltaPipe} from './pipes/time-delta/time-delta.pipe';
import {TimeAgoPipe} from './pipes/time-ago/time-ago.pipe';
import {BytesPipe} from './pipes/bytes/bytes.pipe';

@NgModule({
	declarations: [TimePipe, AmountPipe, UnitPipe, TruncatePipe, TimeDeltaPipe, TimeAgoPipe, BytesPipe],
	imports: [CommonModule],
	exports: [TimePipe, AmountPipe, UnitPipe, TruncatePipe, TimeDeltaPipe, TimeAgoPipe, BytesPipe],
})
export class OrcLocalModule {}
