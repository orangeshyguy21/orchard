/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressCircleComponent} from './components/progress-circle/progress-circle.component';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
/* Vendor Dependencies */
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
	declarations: [ProgressCircleComponent, ProgressBarComponent],
	imports: [CommonModule, MatProgressSpinnerModule],
	exports: [ProgressCircleComponent, ProgressBarComponent],
})
export class OrcProgressModule {}
