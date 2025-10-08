/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */
import {OrcSettingsGeneralModule} from '@client/modules/settings/modules/settings-general/settings-general.module';
/* Local Dependencies */
import {BitcoinSubsectionDisabledComponent} from './components/bitcoin-subsection-disabled/bitcoin-subsection-disabled.component';

@NgModule({
	declarations: [BitcoinSubsectionDisabledComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: BitcoinSubsectionDisabledComponent,
			},
		]),
		MatIconModule,
		OrcSettingsGeneralModule,
	],
	exports: [],
})
export class OrcBitcoinSubsectionDisabledModule {}
