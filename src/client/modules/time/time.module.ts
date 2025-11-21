/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Native Module Dependencies */
import {TimeUtcPipe} from './pipes/time-utc/time-utc.pipe';

@NgModule({
	declarations: [TimeUtcPipe],
	imports: [CommonModule],
	exports: [TimeUtcPipe],
})
export class OrcTimeModule {}
