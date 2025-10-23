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
import {OrcDataModule} from '@client/modules/data/data.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Native Module Dependencies */
import {SettingsSubsectionDeviceComponent} from './components/settings-subsection-device/settings-subsection-device.component';
import {SettingsSubsectionDeviceCategoriesComponent} from './components/settings-subsection-device-categories/settings-subsection-device-categories.component';
import {SettingsSubsectionDeviceTimeComponent} from './components/settings-subsection-device-time/settings-subsection-device-time.component';
import {SettingsSubsectionDeviceTimeTimezoneComponent} from './components/settings-subsection-device-time-timezone/settings-subsection-device-time-timezone.component';
import {SettingsSubsectionDeviceTimeLocaleComponent} from './components/settings-subsection-device-time-locale/settings-subsection-device-time-locale.component';
import {SettingsSubsectionDeviceThemeComponent} from './components/settings-subsection-device-theme/settings-subsection-device-theme.component';
import {SettingsSubsectionDeviceAiComponent} from './components/settings-subsection-device-ai/settings-subsection-device-ai.component';

@NgModule({
	declarations: [
		SettingsSubsectionDeviceComponent,
		SettingsSubsectionDeviceCategoriesComponent,
		SettingsSubsectionDeviceTimeComponent,
		SettingsSubsectionDeviceTimeTimezoneComponent,
		SettingsSubsectionDeviceTimeLocaleComponent,
		SettingsSubsectionDeviceThemeComponent,
		SettingsSubsectionDeviceAiComponent,
	],
	imports: [
		[
			CoreRouterModule.forChild([
				{
					path: '',
					component: SettingsSubsectionDeviceComponent,
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
		OrcDataModule,
		OrcFormModule,
		OrcNavModule,
		OrcAiModule,
	],
})
export class OrcSettingsSubsectionDeviceModule {}
