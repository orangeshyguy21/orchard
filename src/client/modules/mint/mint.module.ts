/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
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
import { MintSectionComponent } from './components/mint-section/mint-section.component';
import { MintSubsectionDashboardComponent } from './components/mint-subsection-dashboard/mint-subsection-dashboard.component';
import { MintSubsectionInfoComponent } from './components/mint-subsection-info/mint-subsection-info.component';
import { MintBalanceSheetComponent } from './components/mint-balance-sheet/mint-balance-sheet.component';
import { MintConnectionsComponent } from './components/mint-connections/mint-connections.component';
import { MintQrcodeDialogComponent } from './components/mint-qrcode-dialog/mint-qrcode-dialog.component';
import { MintAnalyticControlPanelComponent } from './components/mint-analytic-control-panel/mint-analytic-control-panel.component';
import { MintAnalyticChartComponent } from './components/mint-analytic-chart/mint-analytic-chart.component';
import { MintKeysetComponent } from './components/mint-keyset/mint-keyset.component';

const routes: Routes = [
	{
		path: '',
		component: MintSectionComponent,
		children: [
			{
				path: '',
				component: MintSubsectionDashboardComponent,
				title: 'Orchard | Mint',
				data: {
					section: 'mint',
					sub_section: 'dashboard'
				}
			},
			{
				path: 'info',
				component: MintSubsectionInfoComponent,
				title: 'Orchard | Mint Info',
				data: {
					section: 'mint',
					sub_section: 'info'
				}
			},
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
})
export class MintRoutingModule { }


@NgModule({
	declarations: [
		MintSectionComponent,
		MintSubsectionDashboardComponent,
		MintSubsectionInfoComponent,
		MintBalanceSheetComponent,
		MintConnectionsComponent,
		MintQrcodeDialogComponent,
		MintAnalyticControlPanelComponent,
		MintAnalyticChartComponent,
		MintKeysetComponent,
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