/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {CrewUserIconComponent} from './components/crew-user-icon/crew-user-icon.component';

@NgModule({
	declarations: [CrewUserIconComponent],
	imports: [CommonModule, MatIconModule],
	exports: [CrewUserIconComponent],
})
export class OrcCrewModule {}
