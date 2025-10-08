import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventSubsectionLogComponent} from './event-subsection-log.component';

describe('EventSubsectionLogComponent', () => {
	let component: EventSubsectionLogComponent;
	let fixture: ComponentFixture<EventSubsectionLogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventSubsectionLogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventSubsectionLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
