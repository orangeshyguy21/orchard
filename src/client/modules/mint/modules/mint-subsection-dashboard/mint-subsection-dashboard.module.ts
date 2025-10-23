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
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {BaseChartDirective as ChartJsBaseChartDirective} from 'ng2-charts';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintSubsectionDashboardComponent} from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import {MintSubsectionDashboardChartComponent} from './components/mint-subsection-dashboard-chart/mint-subsection-dashboard-chart.component';
import {MintSubsectionDashboardControlComponent} from './components/mint-subsection-dashboard-control/mint-subsection-dashboard-control.component';
import {MintSubsectionDashboardConnectionsComponent} from './components/mint-subsection-dashboard-connections/mint-subsection-dashboard-connections.component';
import {MintSubsectionDashboardConnectionStatusComponent} from './components/mint-subsection-dashboard-connection-status/mint-subsection-dashboard-connection-status.component';
import {MintSubsectionDashboardConnectionDialogComponent} from './components/mint-subsection-dashboard-connection-dialog/mint-subsection-dashboard-connection-dialog.component';

@NgModule({
	declarations: [
		MintSubsectionDashboardComponent,
		MintSubsectionDashboardChartComponent,
		MintSubsectionDashboardControlComponent,
		MintSubsectionDashboardConnectionsComponent,
		MintSubsectionDashboardConnectionStatusComponent,
		MintSubsectionDashboardConnectionDialogComponent,
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
		MatRippleModule,
		MatDialogModule,
		MatTooltipModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatButtonModule,
		ChartJsBaseChartDirective,
		OrcNavModule,
		OrcMintGeneralModule,
	],
	exports: [],
})
export class OrcMintSubsectionDashboardModule {}
