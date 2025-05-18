/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
/* Vendor Dependencies */
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
import { LocalModule } from '@client/modules/local/local.module';
/* Native Module Dependencies */
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';
import { SettingsTimeComponent } from './components/settings-time/settings-time.component';
import { SettingsTimeTimezoneComponent } from './components/settings-time-timezone/settings-time-timezone.component';
import { SettingsTimeLocaleComponent } from './components/settings-time-locale/settings-time-locale.component';
import { SettingsThemeComponent } from './components/settings-theme/settings-theme.component';
import { SettingsAiComponent } from './components/settings-ai/settings-ai.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsSectionComponent,
		title: 'Orchard | Settings',
		data: {
			section: 'settings',
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
	declarations: [],
})
export class SettingsAppRoutingModule { }


@NgModule({
	declarations: [
		SettingsSectionComponent,
		SettingsTimeComponent,
		SettingsTimeTimezoneComponent,
		SettingsTimeLocaleComponent,
		SettingsThemeComponent,
		SettingsAiComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SettingsAppRoutingModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatSelectModule,
		MatSlideToggleModule,
		NavModule,
		LocalModule,
	],
})
export class SettingsAppModule { }