/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
/* Native Dependencies */
import {SettingsGeneralEnvComponent} from './components/settings-general-env/settings-general-env.component';

@NgModule({
	declarations: [SettingsGeneralEnvComponent],
	imports: [CommonModule, MatIconModule, MatButtonModule],
	exports: [SettingsGeneralEnvComponent],
})
export class OrcSettingsGeneralModule {}
