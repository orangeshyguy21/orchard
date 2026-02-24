/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Local Dependencies */
import {CrewFacehashComponent} from './components/crew-facehash/crew-facehash.component';
import {CrewMemberChipComponent} from './components/crew-member-chip/crew-member-chip.component';

@NgModule({
	declarations: [CrewFacehashComponent, CrewMemberChipComponent],
	imports: [CommonModule],
	exports: [CrewFacehashComponent, CrewMemberChipComponent],
})
export class OrcCrewModule {}
