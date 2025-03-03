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
/* Application Dependencies */
import { NavModule } from '@client/modules/nav/nav.module';
import { LocalModule } from '@client/modules/local/local.module';
/* Native Module Dependencies */
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';
import { SettingsTimeComponent } from './components/settings-time/settings-time.component';
import { SettingsTimeTimezoneComponent } from './components/settings-time-timezone/settings-time-timezone.component';

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
})
export class SettingsRoutingModule { }


@NgModule({
	declarations: [
		SettingsSectionComponent,
		SettingsTimeComponent,
		SettingsTimeTimezoneComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SettingsRoutingModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		NavModule,
		LocalModule,
	],
})
export class SettingsModule { }