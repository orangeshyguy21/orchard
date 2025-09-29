/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
/* Local Dependencies */
import {EventNavToolComponent} from './components/event-nav-tool/event-nav-tool.component';
import {EventUnsavedDialogComponent} from './components/event-unsaved-dialog/event-unsaved-dialog.component';
import {EventStackComponent} from './components/event-stack/event-stack.component';
import {EventStackMessageComponent} from './components/event-stack-message/event-stack-message.component';

@NgModule({
	declarations: [EventNavToolComponent, EventUnsavedDialogComponent, EventStackComponent, EventStackMessageComponent],
	imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
	exports: [EventNavToolComponent, EventStackComponent],
})
export class EventModule {}
