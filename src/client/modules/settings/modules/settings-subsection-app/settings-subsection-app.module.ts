/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
import {OrcPublicModule} from '@client/modules/public/public.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Native Module Dependencies */
import {SettingsSubsectionAppComponent} from './components/settings-subsection-app/settings-subsection-app.component';
import {SettingsSubsectionAppBitcoinComponent} from './components/settings-subsection-app-bitcoin/settings-subsection-app-bitcoin.component';
import {SettingsSubsectionAppBitcoinOracleComponent} from './components/settings-subsection-app-bitcoin-oracle/settings-subsection-app-bitcoin-oracle.component';
import {SettingsSubsectionAppAiComponent} from './components/settings-subsection-app-ai/settings-subsection-app-ai.component';

@NgModule({
	declarations: [
		SettingsSubsectionAppComponent,
		SettingsSubsectionAppBitcoinComponent,
		SettingsSubsectionAppBitcoinOracleComponent,
		SettingsSubsectionAppAiComponent,
	],
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
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		OrcFormModule,
		OrcTimeModule,
		OrcPublicModule,
		OrcGraphicModule,
		OrcNavModule,
	],
})
export class OrcSettingsSubsectionAppModule {}
