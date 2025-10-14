/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {EventGeneralStackMessageComponent} from './event-general-stack-message.component';

describe('EventGeneralStackMessageComponent', () => {
	let component: EventGeneralStackMessageComponent;
	let fixture: ComponentFixture<EventGeneralStackMessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventGeneralStackMessageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventGeneralStackMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
