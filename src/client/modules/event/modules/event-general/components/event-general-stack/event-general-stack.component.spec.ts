/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {EventGeneralStackComponent} from './event-general-stack.component';

describe('EventGeneralStackComponent', () => {
	let component: EventGeneralStackComponent;
	let fixture: ComponentFixture<EventGeneralStackComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventGeneralStackComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventGeneralStackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
