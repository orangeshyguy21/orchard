/* Core Dependencies */
import {NgModule} from '@angular/core';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {EventSubsectionLogComponent} from './components/event-subsection-log/event-subsection-log.component';

@NgModule({
	declarations: [EventSubsectionLogComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: EventSubsectionLogComponent,
			},
		]),
		MatIconModule,
	],
	exports: [],
})
export class OrcEventSubsectionLogModule {}
