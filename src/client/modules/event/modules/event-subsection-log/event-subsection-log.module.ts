/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
import {CommonModule as CoreCommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {EventSubsectionLogComponent} from './components/event-subsection-log/event-subsection-log.component';
import { EventSubsectionLogControlComponent } from './components/event-subsection-log-control/event-subsection-log-control.component';

@NgModule({
	declarations: [EventSubsectionLogComponent, EventSubsectionLogControlComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: EventSubsectionLogComponent,
			},
		]),
		CoreCommonModule,
		MatIconModule,
	],
	exports: [],
})
export class OrcEventSubsectionLogModule {}
