/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_LUXON_DATE_ADAPTER_OPTIONS} from '@angular/material-luxon-adapter';
import {BaseChartDirective as ChartJsBaseChartDirective} from 'ng2-charts';
/* Application Dependencies */
import {OrcTimeModule} from '@client/modules/time/time.module';
import {OrcSettingsGeneralModule} from '@client/modules/settings/modules/settings-general/settings-general.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleComponent} from './components/bitcoin-subsection-oracle/bitcoin-subsection-oracle.component';
import {BitcoinSubsectionOracleControlComponent} from './components/bitcoin-subsection-oracle-control/bitcoin-subsection-oracle-control.component';
import {BitcoinSubsectionOracleChartComponent} from './components/bitcoin-subsection-oracle-chart/bitcoin-subsection-oracle-chart.component';

@NgModule({
	declarations: [BitcoinSubsectionOracleComponent, BitcoinSubsectionOracleControlComponent, BitcoinSubsectionOracleChartComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: BitcoinSubsectionOracleComponent,
			},
		]),
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatDatepickerModule,
		ChartJsBaseChartDirective,
		OrcTimeModule,
		OrcSettingsGeneralModule,
	],
	providers: [
		{
			provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
			useValue: {
				defaultOutputCalendar: 'utc',
			},
		},
	],
	exports: [],
})
export class OrcBitcoinSubsectionOracleModule {}
