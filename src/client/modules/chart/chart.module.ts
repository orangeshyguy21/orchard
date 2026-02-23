/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Local Dependencies */
import {ChartGraphicBarsComponent} from './components/chart-graphic-bars/chart-graphic-bars.component';
import {ChartGraphicLineComponent} from './components/chart-graphic-line/chart-graphic-line.component';

@NgModule({
	declarations: [ChartGraphicBarsComponent, ChartGraphicLineComponent],
	imports: [CommonModule],
	exports: [ChartGraphicBarsComponent, ChartGraphicLineComponent],
})
export class OrcChartModule {}
