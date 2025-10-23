/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Local Dependencies */
import {DataBytesPipe} from './pipes/data-bytes/data-bytes.pipe';
import {DataTruncatePipe} from './pipes/data-truncate/data-truncate.pipe';

@NgModule({
	declarations: [DataBytesPipe, DataTruncatePipe],
	imports: [CommonModule],
	exports: [DataBytesPipe, DataTruncatePipe],
})
export class OrcDataModule {}
