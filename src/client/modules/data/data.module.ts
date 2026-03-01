/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Local Dependencies */
import {DataAbsPipe} from './pipes/data-abs/data-abs.pipe';
import {DataBytesPipe} from './pipes/data-bytes/data-bytes.pipe';
import {DataTruncatePipe} from './pipes/data-truncate/data-truncate.pipe';

@NgModule({
	declarations: [DataAbsPipe, DataBytesPipe, DataTruncatePipe],
	imports: [CommonModule],
	exports: [DataAbsPipe, DataBytesPipe, DataTruncatePipe],
})
export class OrcDataModule {}
