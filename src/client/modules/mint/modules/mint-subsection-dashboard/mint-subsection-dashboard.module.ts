/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {BaseChartDirective} from 'ng2-charts';
/* Local Dependencies */
import {MintSubsectionDashboardAnalyticChartComponent} from './mint-subsection-dashboard-analytic-chart/mint-subsection-dashboard-analytic-chart.component';

@NgModule({
	declarations: [MintSubsectionDashboardAnalyticChartComponent],
	imports: [CommonModule, MatIconModule, BaseChartDirective],
	exports: [MintSubsectionDashboardAnalyticChartComponent],
})
export class MintSubsectionDashboardModule {}
