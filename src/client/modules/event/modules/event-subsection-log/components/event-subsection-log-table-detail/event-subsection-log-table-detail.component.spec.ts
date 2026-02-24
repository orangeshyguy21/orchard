/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogActorType, EventLogSection, EventLogEntityType, EventLogType, EventLogStatus} from '@shared/generated.types';
/* Local Dependencies */
import {EventSubsectionLogTableDetailComponent} from './event-subsection-log-table-detail.component';

describe('EventSubsectionLogTableDetailComponent', () => {
	let component: EventSubsectionLogTableDetailComponent;
	let fixture: ComponentFixture<EventSubsectionLogTableDetailComponent>;

	const mock_event_log = new EventLog({
		id: '1',
		actor_type: EventLogActorType.User,
		actor_id: 'user-1',
		timestamp: 1700000000,
		section: EventLogSection.Settings,
		section_id: null,
		entity_type: EventLogEntityType.Setting,
		entity_id: null,
		type: EventLogType.Update,
		status: EventLogStatus.Success,
		details: [],
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEventSubsectionLogModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EventSubsectionLogTableDetailComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('event_log', mock_event_log);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.componentRef.setInput('user', undefined);
		fixture.componentRef.setInput('id_user', null);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
