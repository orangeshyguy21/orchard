/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {ReactiveFormsModule as CoreReactiveFormsModule} from '@angular/forms';
/* Vendor Dependencies */
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Native Module Dependencies */
import {SettingsSubsectionDashboardComponent} from './components/settings-subsection-dashboard/settings-subsection-dashboard.component';
import {SettingsSubsectionDashboardCategoriesComponent} from './components/settings-subsection-dashboard-categories/settings-subsection-dashboard-categories.component';
import {SettingsSubsectionDashboardTimeComponent} from './components/settings-subsection-dashboard-time/settings-subsection-dashboard-time.component';
import {SettingsSubsectionDashboardTimeTimezoneComponent} from './components/settings-subsection-dashboard-time-timezone/settings-subsection-dashboard-time-timezone.component';
import {SettingsSubsectionDashboardTimeLocaleComponent} from './components/settings-subsection-dashboard-time-locale/settings-subsection-dashboard-time-locale.component';
import {SettingsSubsectionDashboardThemeComponent} from './components/settings-subsection-dashboard-theme/settings-subsection-dashboard-theme.component';
import {SettingsSubsectionDashboardAiComponent} from './components/settings-subsection-dashboard-ai/settings-subsection-dashboard-ai.component';

@NgModule({
	declarations: [
		SettingsSubsectionDashboardComponent,
		SettingsSubsectionDashboardCategoriesComponent,
		SettingsSubsectionDashboardTimeComponent,
		SettingsSubsectionDashboardTimeTimezoneComponent,
		SettingsSubsectionDashboardTimeLocaleComponent,
		SettingsSubsectionDashboardThemeComponent,
		SettingsSubsectionDashboardAiComponent,
	],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: SettingsSubsectionDashboardComponent,
				},
			]),
		],
		CoreCommonModule,
		CoreReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatAutocompleteModule,
		MatChipsModule,
		MatCheckboxModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatIconModule,
		MatCardModule,
		OrcLocalModule,
		OrcFormModule,
		OrcAiModule,
	],
})
export class OrcSettingsSubsectionDashboardModule {}
