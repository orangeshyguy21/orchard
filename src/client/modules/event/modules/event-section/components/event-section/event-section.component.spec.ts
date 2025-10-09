/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEventSectionModule} from '@client/modules/event/modules/event-section/event-section.module';
/* Local Dependencies */
import {EventSectionComponent} from './event-section.component';

describe('EventSectionComponent', () => {
	let component: EventSectionComponent;
	let fixture: ComponentFixture<EventSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEventSectionModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EventSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
