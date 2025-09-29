import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventUnsavedDialogComponent} from './event-unsaved-dialog.component';

describe('EventUnsavedDialogComponent', () => {
	let component: EventUnsavedDialogComponent;
	let fixture: ComponentFixture<EventUnsavedDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventUnsavedDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventUnsavedDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
