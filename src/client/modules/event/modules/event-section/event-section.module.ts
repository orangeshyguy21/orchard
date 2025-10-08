/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Local Dependencies */
import {EventSectionComponent} from './components/event-section/event-section.component';

@NgModule({
	declarations: [EventSectionComponent],
	imports: [
		CoreRouterModule.forChild([
			{
				path: '',
				component: EventSectionComponent,
				data: {
					section: 'event',
				},
				children: [
					{
						path: '',
						loadChildren: () =>
							import('@client/modules/event/modules/event-subsection-log/event-subsection-log.module').then(
								(m) => m.OrcEventSubsectionLogModule,
							),
						title: 'Orchard | Event Log',
						data: {
							section: 'event',
							sub_section: 'dashboard',
						},
					},
				],
			},
		]),
		CoreCommonModule,
	],
})
export class OrcEventSectionModule {}
