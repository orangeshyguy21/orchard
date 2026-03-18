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
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
/* Application Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcTimeModule} from '@client/modules/time/time.module';
import {OrcPublicModule} from '@client/modules/public/public.module';
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcAiModule} from '@client/modules/ai/ai.module';
import {OrcProgressModule} from '@client/modules/progress/progress.module';
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcButtonModule} from '@client/modules/button/button.module';
import {pendingEventGuard} from '@client/modules/event/guards/pending-event.guard';
/* Native Module Dependencies */
import {SettingsSubsectionAppComponent} from './components/settings-subsection-app/settings-subsection-app.component';
import {SettingsSubsectionAppBitcoinComponent} from './components/settings-subsection-app-bitcoin/settings-subsection-app-bitcoin.component';
import {SettingsSubsectionAppBitcoinOracleComponent} from './components/settings-subsection-app-bitcoin-oracle/settings-subsection-app-bitcoin-oracle.component';
import {SettingsSubsectionAppAiComponent} from './components/settings-subsection-app-ai/settings-subsection-app-ai.component';
import {SettingsSubsectionAppAiIntegrationComponent} from './components/settings-subsection-app-ai-integration/settings-subsection-app-ai-integration.component';
import {SettingsSubsectionAppAiAgentComponent} from './components/settings-subsection-app-ai-agent/settings-subsection-app-ai-agent.component';
import {SettingsSubsectionAppAiMessagingComponent} from './components/settings-subsection-app-ai-messaging/settings-subsection-app-ai-messaging.component';
import {SettingsSubsectionAppAiJobComponent} from './components/settings-subsection-app-ai-job/settings-subsection-app-ai-job.component';
import {SettingsSubsectionAppAiToolChipsComponent} from './components/settings-subsection-app-ai-tool-chips/settings-subsection-app-ai-tool-chips.component';
import {SettingsSubsectionAppAiAgentFormComponent} from './components/settings-subsection-app-ai-agent-form/settings-subsection-app-ai-agent-form.component';

@NgModule({
	declarations: [
		SettingsSubsectionAppComponent,
		SettingsSubsectionAppBitcoinComponent,
		SettingsSubsectionAppBitcoinOracleComponent,
		SettingsSubsectionAppAiComponent,
		SettingsSubsectionAppAiIntegrationComponent,
		SettingsSubsectionAppAiAgentComponent,
		SettingsSubsectionAppAiMessagingComponent,
		SettingsSubsectionAppAiJobComponent,
		SettingsSubsectionAppAiToolChipsComponent,
		SettingsSubsectionAppAiAgentFormComponent,
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
		MatTabsModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule,
		MatChipsModule,
		OrcFormModule,
		OrcTimeModule,
		OrcPublicModule,
		OrcGraphicModule,
		OrcNavModule,
		OrcAiModule,
		OrcProgressModule,
		OrcLocalModule,
        OrcButtonModule,
	],
})
export class OrcSettingsSubsectionAppModule {}
