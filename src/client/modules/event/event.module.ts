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
import {PendingEventComponent} from './components/pending-event/pending-event.component';

@NgModule({
	declarations: [EventNavToolComponent, PendingEventComponent],
	imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule],
	exports: [EventNavToolComponent],
})
export class EventModule {}
