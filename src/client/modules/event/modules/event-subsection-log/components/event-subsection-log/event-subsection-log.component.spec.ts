/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEventSubsectionLogModule} from '@client/modules/event/modules/event-subsection-log/event-subsection-log.module';
/* Local Dependencies */
import {EventSubsectionLogComponent} from './event-subsection-log.component';

describe('EventSubsectionLogComponent', () => {
	let component: EventSubsectionLogComponent;
	let fixture: ComponentFixture<EventSubsectionLogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEventSubsectionLogModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EventSubsectionLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
