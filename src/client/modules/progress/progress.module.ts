/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressCircleComponent} from './components/progress-circle/progress-circle.component';
/* Vendor Dependencies */
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
	declarations: [ProgressCircleComponent],
	imports: [CommonModule, MatProgressSpinnerModule],
	exports: [ProgressCircleComponent],
})
export class OrcProgressModule {}
