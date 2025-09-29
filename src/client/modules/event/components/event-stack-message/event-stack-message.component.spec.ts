import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventStackMessageComponent} from './event-stack-message.component';

describe('EventStackMessageComponent', () => {
	let component: EventStackMessageComponent;
	let fixture: ComponentFixture<EventStackMessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventStackMessageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventStackMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
