/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiJobDialogComponent} from './settings-subsection-app-ai-job-dialog.component';

describe('SettingsSubsectionAppAiJobDialogComponent', () => {
	let component: SettingsSubsectionAppAiJobDialogComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiJobDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
			declarations: [SettingsSubsectionAppAiJobDialogComponent],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: MAT_DIALOG_DATA, useValue: {name: 'Test Agent'}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiJobDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
