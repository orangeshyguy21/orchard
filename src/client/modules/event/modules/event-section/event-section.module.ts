/* Core Dependencies */
import {NgModule, inject} from '@angular/core';
import {CommonModule as CoreCommonModule} from '@angular/common';
import {RouterModule as CoreRouterModule, ResolveFn} from '@angular/router';
/* Vendor Dependencies */
import {catchError, of} from 'rxjs';
/* Application Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {provideChartConfig} from '@client/modules/chart/chart.providers';
/* Native Dependencies */
import {EventLogService} from '@client/modules/event/services/event-log/event-log.service';
/* Local Dependencies */
import {EventSectionComponent} from './components/event-section/event-section.component';
/* Shared Dependencies */
import {AiAssistant} from '@shared/generated.types';

const eventLogGenesisResolver: ResolveFn<number> = () => {
	const eventLogService = inject(EventLogService);
	return eventLogService.getGenesis().pipe(catchError(() => of(0)));
};

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
						resolve: {
							event_log_genesis: eventLogGenesisResolver,
						},
						data: {
							section: 'event',
							sub_section: 'dashboard',
							assistant: AiAssistant.EventLog,
						},
					},
				],
			},
		]),
		CoreCommonModule,
		OrcNavModule,
	],
	providers: [provideChartConfig()],
})
export class OrcEventSectionModule {}
