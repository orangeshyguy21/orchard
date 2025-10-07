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
import {OrcErrorModule} from '@client/modules/error/error.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcSettingsModule} from '@client/modules/settings/settings.module';
/* Native Dependencies */
import {OrcMintGeneralModule} from './modules/mint-general/mint-general.module';
import {OrcMintSectionGeneralModule} from './modules/mint-section-general/mint-section-general.module';

import {MintSectionComponent} from './components/mint-section/mint-section.component';
/* Local Dependencies */
import {MintAppRoutingModule} from './mint.app.router';

@NgModule({
	declarations: [MintSectionComponent],
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
		OrcErrorModule,
		OrcFormModule,
		OrcSettingsModule,
		OrcMintGeneralModule,
		OrcMintSectionGeneralModule,
	],
})
export class MintAppModule {}
