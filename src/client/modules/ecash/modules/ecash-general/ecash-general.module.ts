/* Core Dependencies */
import {NgModule} from '@angular/core';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Application Dependencies */
import {OrcLocalModule} from '@client/modules/local/local.module';
/* Local Dependencies */
import {EcashGeneralNoteComponent} from './components/ecash-general-note/ecash-general-note.component';

@NgModule({
	declarations: [EcashGeneralNoteComponent],
	imports: [MatIconModule, OrcLocalModule],
	exports: [EcashGeneralNoteComponent],
})
export class OrcEcashGeneralModule {}
