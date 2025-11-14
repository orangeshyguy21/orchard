/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
/* Application Dependencies */
import {OrcSettingsGeneralModule} from '@client/modules/settings/modules/settings-general/settings-general.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleComponent} from './components/bitcoin-subsection-oracle/bitcoin-subsection-oracle.component';
import {BitcoinSubsectionOracleControlComponent} from './components/bitcoin-subsection-oracle-control/bitcoin-subsection-oracle-control.component';

@NgModule({
	declarations: [BitcoinSubsectionOracleComponent, BitcoinSubsectionOracleControlComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: BitcoinSubsectionOracleComponent,
			},
		]),
		CoreReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatDatepickerModule,
		OrcSettingsGeneralModule,
	],
	exports: [],
})
export class OrcBitcoinSubsectionOracleModule {}
