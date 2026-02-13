/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Local Dependencies */
import {CrewFacehashComponent} from './components/crew-facehash/crew-facehash.component';

@NgModule({
	declarations: [CrewFacehashComponent],
	imports: [CommonModule],
	exports: [CrewFacehashComponent],
})
export class OrcCrewModule {}
