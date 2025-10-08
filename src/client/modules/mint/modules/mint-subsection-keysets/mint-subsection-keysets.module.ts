/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {BaseChartDirective as ChartJsBaseChartDirective} from 'ng2-charts';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Local Dependencies */
import {MintSubsectionKeysetsComponent} from './components/mint-subsection-keysets/mint-subsection-keysets.component';
import {MintSubsectionKeysetsControlComponent} from './components/mint-subsection-keysets-control/mint-subsection-keysets-control.component';
import {MintSubsectionKeysetsChartComponent} from './components/mint-subsection-keysets-chart/mint-subsection-keysets-chart.component';
import {MintSubsectionKeysetsTableComponent} from './components/mint-subsection-keysets-table/mint-subsection-keysets-table.component';
import {MintSubsectionKeysetsFormComponent} from './components/mint-subsection-keysets-form/mint-subsection-keysets-form.component';
import {MintSubsectionKeysetsRotationPreviewComponent} from './components/mint-subsection-keysets-rotation-preview/mint-subsection-keysets-rotation-preview.component';

@NgModule({
	declarations: [
		MintSubsectionKeysetsComponent,
		MintSubsectionKeysetsControlComponent,
		MintSubsectionKeysetsChartComponent,
		MintSubsectionKeysetsTableComponent,
		MintSubsectionKeysetsFormComponent,
		MintSubsectionKeysetsRotationPreviewComponent,
	],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: MintSubsectionKeysetsComponent,
				canDeactivate: [pendingEventGuard],
			},
		]),
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatSelectModule,
		MatCardModule,
		MatTableModule,
		MatButtonModule,
		MatSortModule,
		ChartJsBaseChartDirective,
		OrcFormModule,
		OrcLocalModule,
		OrcGraphicModule,
		OrcMintGeneralModule,
	],
	exports: [],
})
export class OrcMintSubsectionKeysetsModule {}
