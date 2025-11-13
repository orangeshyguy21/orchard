/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Native Module Dependencies */
import {SettingsSubsectionAppComponent} from './components/settings-subsection-app/settings-subsection-app.component';
import {SettingsSubsectionAppBitcoinComponent} from './components/settings-subsection-app-bitcoin/settings-subsection-app-bitcoin.component';
import {SettingsSubsectionAppBitcoinOracleComponent} from './components/settings-subsection-app-bitcoin-oracle/settings-subsection-app-bitcoin-oracle.component';

@NgModule({
	declarations: [SettingsSubsectionAppComponent, SettingsSubsectionAppBitcoinComponent, SettingsSubsectionAppBitcoinOracleComponent],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: SettingsSubsectionAppComponent,
					canDeactivate: [pendingEventGuard],
				},
			]),
		],
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatCardModule,
		MatSlideToggleModule,
		OrcFormModule,
	],
})
export class OrcSettingsSubsectionAppModule {}
