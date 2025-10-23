/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatDialogRef} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcSettingsSubsectionUserModule} from '@client/modules/settings/modules/settings-subsection-user/settings-subsection-user.module';
/* Local Dependencies */
import {SettingsSubsectionUserUserPasswordDialogComponent} from './settings-subsection-user-user-password-dialog.component';

describe('SettingsSubsectionUserUserPasswordDialogComponent', () => {
	let component: SettingsSubsectionUserUserPasswordDialogComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserPasswordDialogComponent>;

	beforeEach(async () => {
		const mock_dialog_ref = {
			close: jasmine.createSpy('close'),
		};

		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionUserModule],
			providers: [{provide: MatDialogRef, useValue: mock_dialog_ref}],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserPasswordDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
