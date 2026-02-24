/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Local Dependencies */
import {EventSubsectionLogTableComponent} from './event-subsection-log-table.component';

describe('EventSubsectionLogTableComponent', () => {
	let component: EventSubsectionLogTableComponent;
	let fixture: ComponentFixture<EventSubsectionLogTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEventSubsectionLogModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EventSubsectionLogTableComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('data_source', new MatTableDataSource<EventLog>([]));
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('error', false);
		fixture.componentRef.setInput('users', []);
		fixture.componentRef.setInput('id_user', null);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
