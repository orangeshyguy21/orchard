/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
/* Application Dependencies */
import {OrcSettingsModule} from '@client/modules/settings/settings.module';
/* Local Dependencies */
import {MintSubsectionDisabledComponent} from './components/mint-subsection-disabled/mint-subsection-disabled.component';

@NgModule({
	declarations: [MintSubsectionDisabledComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: MintSubsectionDisabledComponent,
			},
		]),
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		OrcSettingsModule,
	],
	exports: [],
})
export class OrcMintSubsectionDisabledModule {}
