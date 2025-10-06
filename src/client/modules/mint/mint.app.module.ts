/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BaseChartDirective} from 'ng2-charts';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {ErrorModule} from '@client/modules/error/error.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {SettingsModule} from '@client/modules/settings/settings.module';
/* Native Dependencies */
import {OrcMintGeneralModule} from './modules/mint-general/mint-general.module';
import {OrcMintSectionGeneralModule} from './modules/mint-section-general/mint-section-general.module';

import {MintSectionComponent} from './components/mint-section/mint-section.component';
import {MintSubsectionErrorComponent} from './components/mint-subsection-error/mint-subsection-error.component';
import {MintSubsectionDatabaseComponent} from './components/mint-subsection-database/mint-subsection-database.component';
import {MintSubsectionDisabledComponent} from './components/mint-subsection-disabled/mint-subsection-disabled.component';
import {MintDataControlComponent} from './components/mint-data-control/mint-data-control.component';
import {MintDataChartComponent} from './components/mint-data-chart/mint-data-chart.component';
import {MintDataTableComponent} from './components/mint-data-table/mint-data-table.component';
import {MintDataChartLegendComponent} from './components/mint-data-chart-legend/mint-data-chart-legend.component';
import {MintDataMintComponent} from './components/mint-data-mint/mint-data-mint.component';
import {MintDataMintBolt12Component} from './components/mint-data-mint-bolt12/mint-data-mint-bolt12.component';
import {MintDataMeltComponent} from './components/mint-data-melt/mint-data-melt.component';
import {MintDataBackupCreateComponent} from './components/mint-data-backup-create/mint-data-backup-create.component';
import {MintDataBackupRestoreComponent} from './components/mint-data-backup-restore/mint-data-backup-restore.component';
import {MintDataEcashComponent} from './components/mint-data-ecash/mint-data-ecash.component';
/* Local Dependencies */
import {MintAppRoutingModule} from './mint.app.router';

@NgModule({
	declarations: [
		MintSectionComponent,
		MintSubsectionErrorComponent,
		MintSubsectionDatabaseComponent,
		MintSubsectionDisabledComponent,
		MintDataControlComponent,
		MintDataChartComponent,
		MintDataTableComponent,
		MintDataChartLegendComponent,
		MintDataMintComponent,
		MintDataMintBolt12Component,
		MintDataMeltComponent,
		MintDataBackupCreateComponent,
		MintDataBackupRestoreComponent,
		MintDataEcashComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MintAppRoutingModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatCardModule,
		MatRippleModule,
		MatDialogModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatMenuModule,
		MatInputModule,
		MatSelectModule,
		MatSliderModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		BaseChartDirective,
		OrcNavModule,
		OrcLocalModule,
		OrcGraphicModule,
		ErrorModule,
		OrcFormModule,
		SettingsModule,
		OrcMintGeneralModule,
		OrcMintSectionGeneralModule,
	],
})
export class MintAppModule {}
