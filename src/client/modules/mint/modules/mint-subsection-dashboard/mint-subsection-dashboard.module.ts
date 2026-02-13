/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {BaseChartDirective as ChartJsBaseChartDirective} from 'ng2-charts';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintSubsectionDashboardComponent} from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import {MintSubsectionDashboardChartComponent} from './components/mint-subsection-dashboard-chart/mint-subsection-dashboard-chart.component';
import {MintSubsectionDashboardBalanceChartComponent} from './components/mint-subsection-dashboard-balance-chart/mint-subsection-dashboard-balance-chart.component';
import {MintSubsectionDashboardControlComponent} from './components/mint-subsection-dashboard-control/mint-subsection-dashboard-control.component';

@NgModule({
	declarations: [
		MintSubsectionDashboardComponent,
		MintSubsectionDashboardChartComponent,
		MintSubsectionDashboardBalanceChartComponent,
		MintSubsectionDashboardControlComponent,
	],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: MintSubsectionDashboardComponent,
			},
		]),
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDatepickerModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatMenuModule,
		MatCheckboxModule,
		ChartJsBaseChartDirective,
		OrcNavModule,
		OrcFormModule,
		OrcMintGeneralModule,
	],
	exports: [],
})
export class OrcMintSubsectionDashboardModule {}
