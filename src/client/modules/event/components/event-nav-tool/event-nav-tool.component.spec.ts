import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventNavToolComponent} from './event-nav-tool.component';

describe('EventNavToolComponent', () => {
	let component: EventNavToolComponent;
	let fixture: ComponentFixture<EventNavToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventNavToolComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventNavToolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
