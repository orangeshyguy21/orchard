/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
/* Vendor Dependencies */

/* Native Dependencies */
import {ButtonCopyComponent} from './components/button-copy/button-copy.component';

@NgModule({
	imports: [CoreCommonModule],
	declarations: [ButtonCopyComponent],
	exports: [ButtonCopyComponent],
})
export class OrcButtonModule {}
