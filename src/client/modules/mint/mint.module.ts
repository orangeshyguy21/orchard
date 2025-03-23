/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'; 
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseChartDirective } from 'ng2-charts';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
import { LocalModule } from '@client/modules/local/local.module';
import { GraphicModule } from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import { MintRoutingModule } from './mint.router';
/* Native Dependencies */
import { MintSectionComponent } from './components/mint-section/mint-section.component';
import { MintSubsectionErrorComponent } from './components/mint-subsection-error/mint-subsection-error.component';
import { MintSubsectionDashboardComponent } from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import { MintSubsectionInfoComponent } from './components/mint-subsection-info/mint-subsection-info.component';
import { MintSubsectionConfigComponent } from './components/mint-subsection-config/mint-subsection-config.component';
import { MintBalanceSheetComponent } from './components/mint-balance-sheet/mint-balance-sheet.component';
import { MintConnectionsComponent } from './components/mint-connections/mint-connections.component';
import { MintQrcodeDialogComponent } from './components/mint-qrcode-dialog/mint-qrcode-dialog.component';
import { MintAnalyticControlPanelComponent } from './components/mint-analytic-control-panel/mint-analytic-control-panel.component';
import { MintAnalyticChartComponent } from './components/mint-analytic-chart/mint-analytic-chart.component';
import { MintKeysetComponent } from './components/mint-keyset/mint-keyset.component';
import { MintIconComponent } from './components/mint-icon/mint-icon.component';
import { MintNameComponent } from './components/mint-name/mint-name.component';

@NgModule({
	declarations: [
		MintSectionComponent,
		MintSubsectionErrorComponent,
		MintSubsectionDashboardComponent,
		MintSubsectionInfoComponent,
		MintSubsectionConfigComponent,
		MintBalanceSheetComponent,
		MintConnectionsComponent,
		MintQrcodeDialogComponent,
		MintAnalyticControlPanelComponent,
		MintAnalyticChartComponent,
		MintKeysetComponent,
		MintIconComponent,
  		MintNameComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MintRoutingModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatCardModule,
		MatRippleModule,
		MatDialogModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSliderModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		BaseChartDirective,
		NavModule,
		LocalModule,
		GraphicModule,
	],
})
export class MintModule { }