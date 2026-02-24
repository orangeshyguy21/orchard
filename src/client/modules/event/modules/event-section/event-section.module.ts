/* Core Dependencies */
import {NgModule} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule} from '@angular/router';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {EventSectionComponent} from './components/event-section/event-section.component';
/* Shared Dependencies */
import {AiAgent} from '@shared/generated.types';

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
							agent: AiAgent.EventLog,
						},
					},
				],
			},
		]),
		CoreCommonModule,
		OrcNavModule,
	],
})
export class OrcEventSectionModule {}