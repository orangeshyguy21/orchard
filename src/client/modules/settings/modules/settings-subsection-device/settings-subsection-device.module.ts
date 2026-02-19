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
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
import {OrcDataModule} from '@client/modules/data/data.module';
import {OrcFormModule} from '@client/modules/form/form.module';
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Native Module Dependencies */
import {SettingsSubsectionDeviceComponent} from './components/settings-subsection-device/settings-subsection-device.component';
import {SettingsSubsectionDeviceCategoriesComponent} from './components/settings-subsection-device-categories/settings-subsection-device-categories.component';
import {SettingsSubsectionDeviceTimezoneComponent} from './components/settings-subsection-device-timezone/settings-subsection-device-timezone.component';
import {SettingsSubsectionDeviceLocaleComponent} from './components/settings-subsection-device-locale/settings-subsection-device-locale.component';
import {SettingsSubsectionDeviceThemeComponent} from './components/settings-subsection-device-theme/settings-subsection-device-theme.component';
import {SettingsSubsectionDeviceAiComponent} from './components/settings-subsection-device-ai/settings-subsection-device-ai.component';
import {SettingsSubsectionDeviceCurrencyComponent} from './components/settings-subsection-device-currency/settings-subsection-device-currency.component';

@NgModule({
	declarations: [
		SettingsSubsectionDeviceComponent,
		SettingsSubsectionDeviceCategoriesComponent,
		SettingsSubsectionDeviceTimezoneComponent,
		SettingsSubsectionDeviceLocaleComponent,
		SettingsSubsectionDeviceThemeComponent,
		SettingsSubsectionDeviceAiComponent,
		SettingsSubsectionDeviceCurrencyComponent,
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
		MatIconModule,
		MatCardModule,
		MatMenuModule,
		MatButtonModule,
		OrcLocalModule,
		OrcDataModule,
		OrcFormModule,
		OrcNavModule,
		OrcAiModule,
	],
})
export class OrcSettingsSubsectionDeviceModule {}
