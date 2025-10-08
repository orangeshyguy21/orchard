/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {EventGeneralUnsavedDialogComponent} from './event-general-unsaved-dialog.component';

describe('EventGeneralUnsavedDialogComponent', () => {
	let component: EventGeneralUnsavedDialogComponent;
	let fixture: ComponentFixture<EventGeneralUnsavedDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EventGeneralUnsavedDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EventGeneralUnsavedDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
