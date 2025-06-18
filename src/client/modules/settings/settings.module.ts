/* Core Dependencies */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Vendor Dependencies */
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/* Native Dependencies */
import { SettingsEnvComponent } from './components/settings-env/settings-env.component';

@NgModule({
	declarations: [
		SettingsEnvComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
	],
	exports: [
		SettingsEnvComponent
	]
})
export class SettingsModule { }