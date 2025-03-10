/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
/* Vendor Dependencies */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'; 
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
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
	],
	imports: [
		CommonModule,
		MintRoutingModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatCardModule,
		MatRippleModule,
		MatDialogModule,
		NavModule,
		LocalModule,
		GraphicModule,
	],
})
export class MintModule { }