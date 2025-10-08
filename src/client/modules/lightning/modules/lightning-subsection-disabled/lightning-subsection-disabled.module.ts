/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

/* Application Dependencies */
import {OrcSettingsGeneralModule} from '@client/modules/settings/modules/settings-general/settings-general.module';
/* Local Dependencies */
import {LightningSubsectionDisabledComponent} from './components/lightning-subsection-disabled/lightning-subsection-disabled.component';

@NgModule({
	declarations: [LightningSubsectionDisabledComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: LightningSubsectionDisabledComponent,
			},
		]),
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		OrcSettingsGeneralModule,
	],
	exports: [],
})
export class OrcLightningSubsectionDisabledModule {}
