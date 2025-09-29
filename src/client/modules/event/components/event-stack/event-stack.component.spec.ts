import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventStackComponent} from './event-stack.component';

describe('EventStackComponent', () => {
	let component: EventStackComponent;
	let fixture: ComponentFixture<EventStackComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventStackComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventStackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
