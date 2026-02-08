/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Local Dependencies */
import {ChartGraphicBarsComponent} from './components/chart-graphic-bars/chart-graphic-bars.component';

@NgModule({
	declarations: [ChartGraphicBarsComponent],
	imports: [CommonModule],
	exports: [ChartGraphicBarsComponent],
})
export class OrcChartModule {}
