/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcEventGeneralModule} from '@client/modules/event/modules/event-general/event-general.module';
/* Local Dependencies */
import {EventGeneralUnsavedDialogComponent} from './event-general-unsaved-dialog.component';

describe('EventGeneralUnsavedDialogComponent', () => {
	let component: EventGeneralUnsavedDialogComponent;
	let fixture: ComponentFixture<EventGeneralUnsavedDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEventGeneralModule],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: MAT_DIALOG_DATA, useValue: {}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EventGeneralUnsavedDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
