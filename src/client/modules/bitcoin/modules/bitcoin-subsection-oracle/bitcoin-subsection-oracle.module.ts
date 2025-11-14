/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */
import {OrcSettingsGeneralModule} from '@client/modules/settings/modules/settings-general/settings-general.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleComponent} from './components/bitcoin-subsection-oracle/bitcoin-subsection-oracle.component';

@NgModule({
	declarations: [BitcoinSubsectionOracleComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: BitcoinSubsectionOracleComponent,
			},
		]),
		MatIconModule,
		OrcSettingsGeneralModule,
	],
	exports: [],
})
export class OrcBitcoinSubsectionOracleModule {}
