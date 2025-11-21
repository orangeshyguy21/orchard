/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
/* Application Dependencies */
import {OrcProgressModule} from '@client/modules/progress/progress.module';
/* Local Dependencies */
import {EventGeneralNavToolComponent} from './components/event-general-nav-tool/event-general-nav-tool.component';
import {EventGeneralUnsavedDialogComponent} from './components/event-general-unsaved-dialog/event-general-unsaved-dialog.component';
import {EventGeneralStackComponent} from './components/event-general-stack/event-general-stack.component';
import {EventGeneralStackMessageComponent} from './components/event-general-stack-message/event-general-stack-message.component';

@NgModule({
	declarations: [
		EventGeneralNavToolComponent,
		EventGeneralUnsavedDialogComponent,
		EventGeneralStackComponent,
		EventGeneralStackMessageComponent,
	],
	imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule, OrcProgressModule],
	exports: [EventGeneralNavToolComponent, EventGeneralStackComponent, EventGeneralStackMessageComponent],
})
export class OrcEventGeneralModule {}
