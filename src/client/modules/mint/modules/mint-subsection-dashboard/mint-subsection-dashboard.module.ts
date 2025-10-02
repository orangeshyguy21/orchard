/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
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
import {BaseChartDirective} from 'ng2-charts';
/* Application Dependencies */
import {NavModule} from '@client/modules/nav/nav.module';
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintSubsectionDashboardComponent} from './mint-subsection-dashboard/mint-subsection-dashboard.component';
import {MintSubsectionDashboardAnalyticChartComponent} from './mint-subsection-dashboard-analytic-chart/mint-subsection-dashboard-analytic-chart.component';
import {MintSDAnalyticControlPanelComponent} from './mint-sd-analytic-control-panel/mint-sd-analytic-control-panel.component';
import {MintSDConnectionsComponent} from './mint-sd-connections/mint-sd-connections.component';
import {MintSDConnectionStatusComponent} from './mint-sd-connection-status/mint-sd-connection-status.component';
import {MintSDConnectionQrcodeDialogComponent} from './mint-sd-connection-qrcode-dialog/mint-sd-connection-qrcode-dialog.component';

@NgModule({
	declarations: [
		MintSubsectionDashboardComponent,
		MintSubsectionDashboardAnalyticChartComponent,
		MintSDAnalyticControlPanelComponent,
		MintSDConnectionsComponent,
		MintSDConnectionStatusComponent,
		MintSDConnectionQrcodeDialogComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDatepickerModule,
		MatRippleModule,
		MatDialogModule,
		MatTooltipModule,
		MatSliderModule,
		MatSlideToggleModule,
		BaseChartDirective,
		NavModule,
		OrcMintGeneralModule,
	],
	exports: [],
})
export class OrcMintSubsectionDashboardModule {}
